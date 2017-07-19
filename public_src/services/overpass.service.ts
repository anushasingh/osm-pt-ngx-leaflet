import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";

import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { LoadingService } from "./loading.service";
import { MapService } from "./map.service";
import { ProcessingService } from "./processing.service";
import { StorageService } from "./storage.service";

import { create } from "xmlbuilder";

const CONTINUOUS_QUERY: string = `
[out:json][timeout:25][bbox:{{bbox}}];
(
  node["route"="train"];
  node["route"="subway"];
  node["route"="monorail"];
  node["route"="tram"];
  node["route"="bus"];
  node["route"="trolleybus"];
  node["route"="aerialway"];
  node["route"="ferry"];
  node["public_transport"];
);
(._;>;);
out meta;`;

@Injectable()
export class OverpassService {
    public changeset;
    private changeset_id: string;

    constructor(private http: Http, private mapService: MapService,
                private storageService: StorageService,
                private processingService: ProcessingService,
                private loadingService: LoadingService,
                private authService: AuthService) {
        /**
         * @param data - string containing ID of clicked marker
         */
        this.mapService.markerClick.subscribe(
            (data) => {
                const featureId = Number(data);
                if (!this.storageService.elementsDownloaded.has(featureId)) {
                    console.log("LOG (overpass) Requesting started for ", featureId);
                    this.getNodeData(featureId);
                    this.storageService.elementsDownloaded.add(featureId);
                    console.log("LOG (overpass) Requesting finished for", featureId);
                }
            }
        );

        /**
         * Handles downloading of missing relation members (nodes, ways).
         * @param data - object with rel and array containing IDs to download (member.ref)
         * {"rel": rel, "missingElements": missingElements}
         */
        this.processingService.membersToDownload.subscribe(
            (data) => {
                const rel = data["rel"];
                const missingElements = data["missingElements"];
                this.getRelationData(rel, missingElements);
            }
        );
    }

    /**
     * Downloads all data for currently selected node.
     * @param featureId
     */
    private getNodeData(featureId) {
        let requestBody = `
            [out:json][timeout:25][bbox:{{bbox}}];
            (
              node(id:${featureId})
            );
            (._;<);
            out meta;`;
        console.log("LOG (overpass s.) Querying nodes", requestBody);
        this.loadingService.show("Loading clicked feature data...");
        requestBody = this.replaceBboxString(requestBody);
        const options = this.setRequestOptions("application/X-www-form-urlencoded");
        this.http.post("https://overpass-api.de/api/interpreter", requestBody, options)
            .map((res) => res.json())
            .subscribe((response) => {
                if (!response) {
                    this.loadingService.hide();
                    return alert("FIXME: No response, please try to click anything again.");
                }
                console.log("LOG (overpass)", response);
                this.processingService.processNodeResponse(response);
                this.loadingService.hide();
                this.getRouteMasters(10);
                // TODO this.processingService.drawStopAreas();
            });
    }

    /**
     * Downloads all missing data for currently explored relation.
     * @param rel
     * @param missingElements
     */
    private getRelationData(rel: any, missingElements: number[]) {
        if (missingElements.length === 0) {
            return alert("This relation has no stops: \n" + JSON.stringify(rel));
        }
        const requestBody = `
            [out:json][timeout:25];
            (
              node(id:${missingElements})
            );
            (._;);
            out meta;`;
        console.log("LOG (overpass s.) Should download missing members with query:", requestBody, missingElements);
        // FIXME loading can't be closed sometimes?
        // this.loadingService.show("Loading relation's missing members...");
        const options = this.setRequestOptions("application/X-www-form-urlencoded");
        this.http.post("https://overpass-api.de/api/interpreter", requestBody, options)
            .map((res) => res.json())
            .subscribe((response) => {
                if (!response) {
                    this.loadingService.hide();
                    return alert("No response, try again please.");
                }
                this.processingService.processNodeResponse(response);

                const transformedGeojson = this.mapService.osmtogeojson(response);
                // FIXME save all requests...
                // this.storageService.localGeojsonStorage = transformedGeojson;
                this.mapService.renderTransformedGeojsonData(transformedGeojson);

                // continue with the rest of "exploreRelation" function
                console.log("LOG (overpass s.) Continue with downloaded missing members", rel);
                this.storageService.elementsDownloaded.add(rel.id);
                this.processingService.downloadedMissingMembers(rel, true);
            });
    }

    /**
     * Requests new batch of data from Overpass.
     */
    public requestNewOverpassData(): void {
        this.loadingService.show("Loading bus stops...");
        const requestBody = this.replaceBboxString(CONTINUOUS_QUERY);
        const options = this.setRequestOptions("application/X-www-form-urlencoded");
        this.mapService.previousCenter = [this.mapService.map.getCenter().lat, this.mapService.map.getCenter().lng];
        this.http.post("https://overpass-api.de/api/interpreter", requestBody, options)
            .map((res) => {
                this.loadingService.hide();
                console.log("LOG (overpass)", res);
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log("LOG (overpass s.) Stops response error", res.status, res.text);
                    return setTimeout(function() {
                        console.log("LOG (overpass) Request error - new request?");
                        this.requestNewOverpassData();
                    }.bind(this), 5000);
                }
            })
            .subscribe((response) => {
                this.processingService.processResponse(response);
                // FIXME
                // this.processingService.drawStopAreas();
                // this.getRouteMasters();
            });
    }

    /**
     * Finds routes which were not queried to find their possible master relation.
     */
    private findRouteIdsWithoutMaster(): Array<number> {
        const idsArr = [];
        this.storageService.listOfRelations.forEach( (rel) => {
            if (!this.storageService.queriedMasters.has(rel["id"])) {
                idsArr.push(rel["id"]);
            }
        });
        return idsArr;
    }

    /**
     *
     * @param {number[]} idsArr
     */
    private markQueriedRelations(idsArr: number[]): void {
        idsArr.forEach( (id) => this.storageService.queriedMasters.add(id) );
    }

    /**
     * Downloads route_master relations for currently added route relations.
     * @minNumOfRelations: number
     */
    public getRouteMasters(minNumOfRelations?: number) {
        if (!minNumOfRelations) {
            minNumOfRelations = 10;
        }
        this.loadingService.show("Loading route master relations...");
        const idsArr: Array<number> = this.findRouteIdsWithoutMaster();
        if (idsArr.length <= minNumOfRelations) {
            this.loadingService.hide();
            return console.log("LOG (overpass s.) Not enough relations to download - stop");
        } else if (!idsArr.length ) {
            // do not query masters if all relations are already known
            this.loadingService.hide();
            return;
        }
        let requestBody: string = `
            [out:json][timeout:25][bbox:{{bbox}}];
            (
              rel(id:${idsArr.join(", ")});
              <<;
            );
            out meta;`;
        console.log("LOG (overpass s.) Querying rel.'s route masters with query:", requestBody);
        requestBody = this.replaceBboxString(requestBody);
        const options = this.setRequestOptions("application/X-www-form-urlencoded");
        this.http.post("https://overpass-api.de/api/interpreter", requestBody, options)
            .map((res) => res.json())
            .subscribe((response) => {
                this.loadingService.hide();
                if (!response) {
                    return alert("FIXME: No response, please try to select other master rel. again.");
                }
                this.markQueriedRelations(idsArr);
                this.processingService.processMastersResponse(response);
            });
    }

    /**
     * @param requestBody
     */
    public requestOverpassData(requestBody: string): void {
        this.loadingService.show();
        this.mapService.clearLayer();
        requestBody = this.replaceBboxString(requestBody);
        const options = this.setRequestOptions("application/X-www-form-urlencoded");
        this.mapService.renderData(requestBody, options);
    }

    /**
     * Replaces {{bbox}} query string to actual bbox of the map view.
     * @param requestBody
     * @returns {string}
     */
    private replaceBboxString(requestBody: string): string {
        const b = this.mapService.map.getBounds();
        const s = b.getSouth().toString();
        const w = b.getWest().toString();
        const n = b.getNorth().toString();
        const e = b.getEast().toString();
        return requestBody.replace(new RegExp("{{bbox}}", "g"), [s, w, n, e].join(", "));
    }

    /**
     * Creates new request options with headers.
     * @param contentType
     * @returns {RequestOptions}
     */
    private setRequestOptions(contentType): RequestOptions {
        const headers = new Headers();
        headers.append("Content-Type", contentType);
        return new RequestOptions({ headers });
    }

    /**
     * Create basic changeset body.
     * @param metadata - contains source and comment added by user
     * @returns {string}
     */
    private createChangeset(metadata: object): string {
        console.log("LOG (overpass)", metadata["source"], metadata["comment"]);
        const changeset = create("osm").ele("changeset")
            .ele("tag", { "k": "created_by", "v": ConfigService.appName }).up()
            .ele("tag", { "k": "source", "v": metadata["source"] }).up()
            .ele("tag", { "k": "comment", "v": metadata["comment"] })
            .end({ pretty: true });

        console.log("LOG (overpass)", changeset);
        return changeset;
    }

    public uploadData(metadata: object) {
        this.changeset = this.createChangeset(metadata);
        this.putChangeset(this.changeset);
    }

    /**
     * Adds changeset ID as an attribute to the request.
     * @param changeset_id
     */
    private addChangesetId(changeset_id): void {
        this.changeset_id = changeset_id;
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.changeset, "application/xml");
        doc.querySelector("changeset").setAttribute("id", changeset_id);
        this.changeset = doc;
        console.log("LOG (overpass)", this.changeset, doc);
    }

    /**
     * Creates new changeset on the API and returns its ID in the callback.
     * Put /api/0.6/changeset/create
     */
    public putChangeset(changeset): void {
        this.authService.oauth.xhr({
            content: "<osm><changeset></changeset></osm>", // changeset,
            method: "PUT",
            options: { header: { "Content-Type": "text/xml" } },
            path: "/api/0.6/changeset/create"
        }, this.createdChangeset.bind(this));
    }

    /**
     *
     * @param err
     * @param changeset_id
     */
    private createdChangeset(err, changeset_id) {
        if (err) {
            return alert("Error while creating new changeset " + err);
        }
        console.log("LOG (overpass) Created new changeset with ID: ", changeset_id);
        this.addChangesetId(changeset_id);
        const osmChangeContent = "<osmChange></osmChange>";
        if (!this.storageService.edits) { return alert("LOG: create some edits before uploading changes"); }
        // get unique IDs of all edits and add only these to changeset
        const idsChanged = new Set();
        for (const edit of this.storageService.edits) {
            if (!idsChanged.has(edit["id"])) {
                idsChanged.add(edit["id"]);
            }
        }
        const changedElements = [];
        const changedElementsArr = Array.from(idsChanged.keys());
        for (const element of this.storageService.localJsonStorage.elements) {
            if (changedElementsArr.indexOf(element.id) > -1) {
                changedElements.push(element);
            }
        }

        console.log("LOG (overpass) Changed documents: ", changedElements);
        // TODO - add XML element <create> later create (maybe delete too)
        const xml = create("osmChange", { "@version": "0.6", "@generator": ConfigService.appName } )
            .ele("modify");
        for (const el of changedElements) {
            console.log("LOG (overpass) I should transform ", el);
            const tagsObj: object = {};
            for (const key of Object.keys(el)) {
                // do not add some attributes because they are added automatically on API
                if (["members", "tags", "type", "timestamp", "uid", "user"].indexOf(key) === -1) {
                    // adds - id="123", uid="123", etc.
                    if (["version"].indexOf(key) > -1) {
                        tagsObj[key] = el[key]; // API should increment version later
                    } else if (["changeset"].indexOf(key) > -1) {
                        tagsObj[key] = this.changeset_id;
                    } else {
                        tagsObj[key] = el[key];
                    }

                }
            }
            const objectType = xml.ele(el["type"], tagsObj); // adds XML element node|way|relation
            if (el["type"] === "relation" && el["members"]) {
                const members = el["members"]; // array of objects
                members.forEach( (mem) => {
                    if (mem === members[members.length - 1]) {
                        objectType.ele("member", { "type": mem["type"], "ref": mem["ref"], "role": mem["role"] });
                    } else {
                        objectType.ele("member", { "type": mem["type"], "ref": mem["ref"], "role": mem["role"] }).up();
                    }
                });
            }
            if (el["tags"]) {
                const tags = Object.keys(el["tags"]); // objects
                for (const tag of tags) {
                    if (tag === tags[tags.length - 1]) {
                        objectType.ele("tag", { "k": tag, "v": el["tags"][tag] });
                    } else {
                        objectType.ele("tag", { "k": tag, "v": el["tags"][tag] }).up();
                    }
                }
            }
        }
        const xmlString = xml.end({ pretty: true });
        console.log("LOG (overpass) Uploading this XML ", xml, xmlString);
        this.authService.oauth.xhr.bind(this)({
            content: xmlString, // .osmChangeJXON(this.changes) // JXON.stringify(),
            method: "POST",
            options: { header: { "Content-Type": "text/xml" } },
            path: "/api/0.6/changeset/" + this.changeset_id + "/upload"
        }, this.uploadedChangeset.bind(this));
    }

    /**
     * Tries to close changeset after it is uploaded.
     * @param err
     */
    private uploadedChangeset(err) {
        if (err) {
            return alert("Error after data uploading. Changeset is not closed." + err);
        }
        // Upload was successful, safe to call the callback.
        // Add delay to allow for postgres replication #1646 #2678
        window.setTimeout(function() {
            console.log("LOG (overpass) Timeout 2500");
            // callback(null, this.changeset);
            // Still attempt to close changeset, but ignore response because iD/issues/2667
            this.authService.oauth.xhr({
                method: "PUT",
                options: { header: { "Content-Type": "text/xml" } },
                path: "/api/0.6/changeset/" + this.changeset_id + "/close"
            }, () => {
                return true;
            });
        }.bind(this), 2500);
    }
}
