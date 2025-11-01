import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function GET() {
    // Define the CSV template headers and example data
    const csvTemplate = [
        "text,isMultiple,options,correctIndexes",
        `"What is 2 + 2?",false,"1|2|3|4","3"`,
        `"Which of these are fruits?",true,"Apple|Car|Orange|Banana","0|2|3"`,
        `"Capital of France?",false,"Paris|London|Berlin|Madrid","0"`,
    ].join("\n");

    // Create a readable stream for the CSV content
    const stream = Readable.from([csvTemplate]);

    // Return response as downloadable CSV
    return new NextResponse(stream as any, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="quiz-template.csv"',
        },
    });
}
