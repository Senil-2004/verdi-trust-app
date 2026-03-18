import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle } from 'docx';

const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1 },
    bottom: { style: BorderStyle.SINGLE, size: 1 },
    left: { style: BorderStyle.SINGLE, size: 1 },
    right: { style: BorderStyle.SINGLE, size: 1 },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
    insideVertical: { style: BorderStyle.SINGLE, size: 1 },
};

const createTableCell = (text, isHeader = false) => {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({ text: text || '--', bold: isHeader })]
        })],
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
};

const createTable = (rows) => {
    const tableRows = rows.map((row, index) => {
        return new TableRow({
            children: row.map(cell => createTableCell(cell.toString(), index === 0))
        });
    });

    return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorder
    });
};

const tablesData = [
    {
        name: "1. listings",
        pk: "id",
        fk: "None",
        rows: [
            ["No", "Field Name", "Datatype (Size)", "Key Constraints", "Description"],
            [1, "id", "INT", "Primary Key, Auto Increment", "Unique identifier for the listing"],
            [2, "project_source", "VARCHAR(255)", "NOT NULL", "Source name of the project"],
            [3, "volume", "INT", "NOT NULL", "Total volume of credits"],
            [4, "price", "DECIMAL(10, 2)", "NOT NULL", "Price per credit"],
            [5, "status", "VARCHAR(50)", "DEFAULT 'Active'", "Current status of the listing"],
            [6, "fill_percentage", "INT", "DEFAULT 0", "Percentage filled/sold"],
            [7, "type", "VARCHAR(50)", "--", "Category/type of project"],
            [8, "vintage", "INT", "--", "Year of vintage"],
            [9, "certificate_file", "VARCHAR(255)", "--", "URL to certificate"],
            [10, "cover_image", "VARCHAR(255)", "--", "URL to cover image"],
            [11, "created_at", "TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", "Timestamp of creation"]
        ]
    },
    {
        name: "2. transactions",
        pk: "id",
        fk: "None",
        rows: [
            ["No", "Field Name", "Datatype (Size)", "Key Constraints", "Description"],
            [1, "id", "INT", "Primary Key, Auto Increment", "Unique identifier"],
            [2, "buyer_name", "VARCHAR(255)", "NOT NULL", "Name of the buyer"],
            [3, "credits", "INT", "NOT NULL", "Amount of credits bought"],
            [4, "amount", "DECIMAL(15, 2)", "NOT NULL", "Total transaction amount"],
            [5, "transaction_date", "TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", "Date of transaction"],
            [6, "status", "VARCHAR(50)", "DEFAULT 'Processing'", "Status of transaction"],
            [7, "razorpay_payment_id", "VARCHAR(255)", "--", "Identifier for Razorpay"]
        ]
    },
    {
        name: "3. users",
        pk: "id",
        fk: "None",
        rows: [
            ["No", "Field Name", "Datatype (Size)", "Key Constraints", "Description"],
            [1, "id", "INT", "Primary Key, Auto Increment", "Unique identifier"],
            [2, "name", "VARCHAR(255)", "NOT NULL", "Full name of the user"],
            [3, "email", "VARCHAR(255)", "UNIQUE, NOT NULL", "User email address"],
            [4, "role", "VARCHAR(50)", "NOT NULL", "Role of the user"],
            [5, "status", "VARCHAR(50)", "DEFAULT 'Active'", "Account status"],
            [6, "joined_at", "TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", "Registration date"]
        ]
    },
    {
        name: "4. projects",
        pk: "id",
        fk: "None",
        rows: [
            ["No", "Field Name", "Datatype (Size)", "Key Constraints", "Description"],
            [1, "id", "INT", "Primary Key, Auto Increment", "Unique identifier"],
            [2, "name", "VARCHAR(255)", "NOT NULL", "Name of the project"],
            [3, "region", "VARCHAR(100)", "--", "Region of the project"],
            [4, "status", "VARCHAR(50)", "DEFAULT 'Pending'", "Project approval status"],
            [5, "developer", "VARCHAR(255)", "--", "Name of the developer"],
            [6, "submitted_at", "TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", "Submission date"]
        ]
    },
    {
        name: "5. notifications",
        pk: "id",
        fk: "None",
        rows: [
            ["No", "Field Name", "Datatype (Size)", "Key Constraints", "Description"],
            [1, "id", "INT", "Primary Key, Auto Increment", "Unique identifier"],
            [2, "title", "VARCHAR(255)", "NOT NULL", "Title of the notification"],
            [3, "message", "TEXT", "--", "Content of the message"],
            [4, "is_read", "BOOLEAN", "DEFAULT FALSE", "Read status"],
            [5, "created_at", "TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", "Date created"]
        ]
    }
];

const children = [];

tablesData.forEach(data => {
    children.push(new Paragraph({
        children: [new TextRun({ text: data.name, bold: true, size: 28 })]
    }));
    children.push(new Paragraph({
        children: [new TextRun({ text: `Primary Key: ${data.pk}`, size: 24 })]
    }));
    children.push(new Paragraph({
        children: [new TextRun({ text: `Foreign Keys:`, size: 24 })]
    }));
    if (data.fk === "None") {
        children.push(new Paragraph({
            children: [new TextRun({ text: `    • None`, size: 24 })]
        }));
    } else {
        children.push(new Paragraph({
            children: [new TextRun({ text: `    • ${data.fk}`, size: 24 })]
        }));
    }
    
    // Add spacing before table
    children.push(new Paragraph({ text: "" }));
    
    children.push(createTable(data.rows));
    
    // Add spacing after table
    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({ text: "" }));
});

const doc = new Document({
    sections: [{
        properties: {},
        children: children
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("C:\\Users\\Senil Cyriac\\Downloads\\Database_Schema_Tables.docx", buffer);
    console.log("Document created successfully at Downloads folder.");
});
