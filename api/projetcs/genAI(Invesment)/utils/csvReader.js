import fs from 'fs';
import csv from 'csv-parser';
import { Readable } from 'stream';
const CSVReader = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(fileBuffer.toString("utf8"));
        stream
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));

    })
}

export { CSVReader } 