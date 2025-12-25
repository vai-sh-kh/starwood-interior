"use strict";
/**
 * Leads Seeding Script
 *
 * This script creates 50 sample leads in the database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var supabase_js_1 = require("@supabase/supabase-js");
// Load environment variables from .env.local
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), ".env.local") });
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// Sample data arrays
var firstNames = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Jessica",
    "Robert", "Ashley", "William", "Amanda", "Richard", "Melissa", "Joseph",
    "Nicole", "Thomas", "Michelle", "Charles", "Kimberly", "Christopher", "Amy",
    "Daniel", "Angela", "Matthew", "Lisa", "Anthony", "Nancy", "Mark", "Karen",
    "Donald", "Betty", "Steven", "Helen", "Paul", "Sandra", "Andrew", "Donna",
    "Joshua", "Carol", "Kenneth", "Ruth", "Kevin", "Sharon", "Brian", "Michelle",
    "George", "Laura", "Timothy", "Emily"
];
var lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris",
    "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
    "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
    "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
    "Roberts", "Gomez", "Phillips"
];
var sources = [
    "contact_form",
    "referral",
    "social_media",
    "website",
    "phone_call",
    "email",
    "walk_in",
    "event"
];
var statuses = [
    "new",
    "contacted",
    "qualified",
    "converted",
    "lost"
];
var messages = [
    "Interested in a complete home renovation. Looking for modern design with sustainable materials.",
    "Need consultation for kitchen remodeling. Budget around $50k.",
    "Want to redesign my living room. Prefer minimalist style.",
    "Looking for interior design services for a new apartment.",
    "Interested in bathroom renovation. Need quotes for 3 bathrooms.",
    "Want to update my office space with contemporary design.",
    "Need help with color scheme and furniture selection for entire house.",
    "Looking for eco-friendly interior design solutions.",
    "Interested in smart home integration with interior design.",
    "Need design consultation for a commercial space.",
    "Want to transform my bedroom into a luxury suite.",
    "Looking for Scandinavian design style for my home.",
    "Interested in vintage/retro interior design.",
    "Need help with space optimization for small apartment.",
    "Want to create a home office that's both functional and stylish.",
    "Looking for outdoor space design and landscaping ideas.",
    "Interested in luxury interior design for penthouse.",
    "Need consultation for home staging before selling.",
    "Want to incorporate art and sculptures into interior design.",
    "Looking for budget-friendly renovation options.",
    "Interested in traditional Indian design with modern touches.",
    "Need help with lighting design for entire home.",
    "Want to create a kid-friendly yet elegant living space.",
    "Looking for sustainable and green building materials.",
    "Interested in open floor plan design.",
    "Need consultation for restaurant interior design.",
    "Want to redesign my master bedroom and ensuite.",
    "Looking for home automation integration with design.",
    "Interested in coastal/beach house interior style.",
    "Need help with storage solutions and organization.",
    "Want to create a home gym that blends with living space.",
    "Looking for pet-friendly interior design solutions.",
    "Interested in industrial loft style design.",
    "Need consultation for home theater room design.",
    "Want to update my home with latest design trends.",
    "Looking for accessible design for elderly family members.",
    "Interested in Feng Shui principles in interior design.",
    "Need help with window treatments and curtains.",
    "Want to create a meditation/yoga space at home.",
    "Looking for multi-generational home design solutions.",
    "Interested in smart storage and hidden compartments.",
    "Need consultation for holiday home interior design.",
    "Want to incorporate plants and biophilic design.",
    "Looking for energy-efficient design solutions.",
    "Interested in custom furniture design and installation.",
    "Need help with color psychology in interior design.",
    "Want to create a wine cellar and tasting room.",
    "Looking for sustainable flooring options.",
    "Interested in acoustic design for home office.",
    "Need consultation for outdoor kitchen and dining area."
];
var avatarColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52BE80",
    "#EC7063", "#5DADE2", "#F4D03F", "#AF7AC5", "#48C9B0"
];
function generateRandomEmail(firstName, lastName) {
    var domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    var domain = domains[Math.floor(Math.random() * domains.length)];
    var randomNum = Math.floor(Math.random() * 1000);
    return "".concat(firstName.toLowerCase(), ".").concat(lastName.toLowerCase()).concat(randomNum, "@").concat(domain);
}
function generateRandomPhone() {
    var areaCode = Math.floor(Math.random() * 900) + 100;
    var exchange = Math.floor(Math.random() * 900) + 100;
    var number = Math.floor(Math.random() * 10000);
    return "+1-".concat(areaCode, "-").concat(exchange, "-").concat(number.toString().padStart(4, "0"));
}
function generateLeads(count) {
    var leads = [];
    var usedEmails = new Set();
    for (var i = 0; i < count; i++) {
        var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        var name_1 = "".concat(firstName, " ").concat(lastName);
        // Ensure unique emails
        var email = generateRandomEmail(firstName, lastName);
        while (usedEmails.has(email)) {
            email = generateRandomEmail(firstName, lastName);
        }
        usedEmails.add(email);
        var phone = Math.random() > 0.2 ? generateRandomPhone() : null; // 80% have phone
        var message = messages[Math.floor(Math.random() * messages.length)];
        var source = sources[Math.floor(Math.random() * sources.length)];
        var status_1 = statuses[Math.floor(Math.random() * statuses.length)];
        var avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
        leads.push({
            name: name_1,
            email: email,
            phone: phone,
            message: message,
            source: source,
            status: status_1,
            avatar_color: avatarColor,
        });
    }
    return leads;
}
function seedLeads() {
    return __awaiter(this, void 0, void 0, function () {
        var supabaseAdmin, leads, batchSize, inserted, errors, i, batch, _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!supabaseUrl) {
                        console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
                        process.exit(1);
                    }
                    if (!serviceRoleKey) {
                        console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
                        console.error("\n💡 To get your service role key:");
                        console.error("   1. Go to your Supabase Dashboard");
                        console.error("   2. Navigate to: Settings → API");
                        console.error("   3. Copy the 'service_role' key (keep it secret!)");
                        console.error("   4. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY\n");
                        process.exit(1);
                    }
                    supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
                        auth: {
                            autoRefreshToken: false,
                            persistSession: false,
                        },
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    console.log("\n📝 Seeding Leads");
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                    leads = generateLeads(50);
                    console.log("\uD83D\uDCE6 Generated ".concat(leads.length, " leads"));
                    batchSize = 10;
                    inserted = 0;
                    errors = 0;
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < leads.length)) return [3 /*break*/, 5];
                    batch = leads.slice(i, i + batchSize);
                    return [4 /*yield*/, supabaseAdmin
                            .from("leads")
                            .insert(batch)
                            .select()];
                case 3:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("\u274C Error inserting batch ".concat(Math.floor(i / batchSize) + 1, ":"), error.message);
                        errors += batch.length;
                    }
                    else {
                        inserted += (data === null || data === void 0 ? void 0 : data.length) || 0;
                        console.log("\u2705 Inserted batch ".concat(Math.floor(i / batchSize) + 1, " (").concat((data === null || data === void 0 ? void 0 : data.length) || 0, " leads)"));
                    }
                    _b.label = 4;
                case 4:
                    i += batchSize;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    console.log("\n\uD83D\uDCCA Summary:");
                    console.log("   \u2705 Successfully inserted: ".concat(inserted, " leads"));
                    if (errors > 0) {
                        console.log("   \u274C Failed to insert: ".concat(errors, " leads"));
                    }
                    console.log("\n🎉 Leads seeding completed!\n");
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error("\n❌ Error seeding leads:");
                    if (error_1 instanceof Error) {
                        console.error("   ".concat(error_1.message));
                    }
                    else {
                        console.error("   Unknown error occurred");
                    }
                    console.error("\n💡 Troubleshooting:");
                    console.error("   - Ensure Supabase is running: pnpm supabase:start");
                    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is correct");
                    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is set correctly\n");
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
seedLeads();
