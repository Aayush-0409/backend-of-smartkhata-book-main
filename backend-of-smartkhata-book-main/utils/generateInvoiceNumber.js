import Counter from "../models/Counter.js";

function slugify(name = "") {
    const cleaned = name.toString().toUpperCase().replace(/[^A-Z0-9]/g, "");
    return cleaned.slice(0, 6) || "SHOP";
}

function formatDate(date) {
    const d = date ? new Date(date) : new Date();

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
}

export async function getNextInvoiceNumber(wholesalerName, orderDate) {
    const datePart = formatDate(orderDate);
    const namePart = slugify(wholesalerName);
    const counterKey = `${namePart}-${datePart}`;

    const counter = await Counter.findOneAndUpdate(
        { name: counterKey },
        { $inc: { value: 1 } },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    return `${namePart}-${datePart}-${String(counter.value).padStart(4, "0")}`;
}