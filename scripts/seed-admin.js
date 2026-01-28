"use strict";
/**
 * Admin User Creation Script
 *
 * This script creates/verifies an admin user in the remote Supabase database.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Note: If Supabase Auth API returns 500 errors, the user may already exist.
 * Check the Supabase Dashboard to verify the user status.
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
var ADMIN_EMAIL = process.env.ADMIN_EMAIL;
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function () {
        var supabaseAdmin, _a, existingUsers, listError, existingUser, updateError, _b, createUrl, createResponse, newUser, errorText, errorData, error_1;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
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
                    if (!ADMIN_EMAIL) {
                        console.error("❌ Error: ADMIN_EMAIL is not set in .env.local");
                        console.error("   Add ADMIN_EMAIL=your-email@example.com to .env.local\n");
                        process.exit(1);
                    }
                    if (!ADMIN_PASSWORD) {
                        console.error("❌ Error: ADMIN_PASSWORD is not set in .env.local");
                        console.error("   Add ADMIN_PASSWORD=your-secure-password to .env.local\n");
                        process.exit(1);
                    }
                    supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
                        auth: {
                            autoRefreshToken: false,
                            persistSession: false,
                        },
                        db: {
                            schema: 'public',
                        },
                    });
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 13, , 14]);
                    console.log("\n🔐 Creating Admin User (Remote Database)");
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                    console.log("\uD83D\uDCE1 Remote Supabase: ".concat(supabaseUrl));
                    console.log("\uD83D\uDCE7 Admin Email: ".concat(ADMIN_EMAIL, "\n"));
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, supabaseAdmin.auth.admin.listUsers()];
                case 3:
                    _a = _g.sent(), existingUsers = _a.data, listError = _a.error;
                    if (!(!listError && (existingUsers === null || existingUsers === void 0 ? void 0 : existingUsers.users))) return [3 /*break*/, 5];
                    existingUser = existingUsers.users.find(function (u) { return u.email === ADMIN_EMAIL; });
                    if (!existingUser) return [3 /*break*/, 5];
                    console.log("\u2705 Admin user already exists!");
                    console.log("   User ID: ".concat(existingUser.id));
                    console.log("   Email: ".concat(existingUser.email));
                    console.log("   Email Confirmed: ".concat(existingUser.email_confirmed_at ? 'Yes' : 'No'));
                    // Update password and confirm email
                    console.log("\n🔄 Updating password and confirming email...");
                    return [4 /*yield*/, supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                            password: ADMIN_PASSWORD,
                            email_confirm: true,
                        })];
                case 4:
                    updateError = (_g.sent()).error;
                    if (updateError) {
                        console.log("⚠️  Could not update password via Admin API");
                        console.log("   User exists but password may need manual reset via Dashboard");
                    }
                    else {
                        console.log("✅ Password updated and email confirmed!");
                    }
                    console.log("\n🎉 Admin user is ready to use!\n");
                    return [2 /*return*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    _b = _g.sent();
                    console.log("⚠️  Admin API not available, trying REST API...");
                    return [3 /*break*/, 7];
                case 7:
                    // If Admin API doesn't work, try REST API
                    console.log("\uD83D\uDCE7 Creating new admin user via REST API...");
                    createUrl = "".concat(supabaseUrl, "/auth/v1/admin/users");
                    return [4 /*yield*/, fetch(createUrl, {
                            method: 'POST',
                            headers: {
                                'apikey': serviceRoleKey,
                                'Authorization': "Bearer ".concat(serviceRoleKey),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: ADMIN_EMAIL,
                                password: ADMIN_PASSWORD,
                                email_confirm: true,
                                user_metadata: {
                                    role: 'admin'
                                }
                            }),
                        })];
                case 8:
                    createResponse = _g.sent();
                    if (!createResponse.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, createResponse.json()];
                case 9:
                    newUser = _g.sent();
                    console.log("\u2705 Admin user created successfully!");
                    console.log("   Email: ".concat(((_c = newUser.user) === null || _c === void 0 ? void 0 : _c.email) || ADMIN_EMAIL));
                    console.log("   User ID: ".concat(((_d = newUser.user) === null || _d === void 0 ? void 0 : _d.id) || 'N/A'));
                    console.log("\n🎉 You can now log in with the admin credentials!\n");
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, createResponse.text()];
                case 11:
                    errorText = _g.sent();
                    errorData = void 0;
                    try {
                        errorData = JSON.parse(errorText);
                    }
                    catch (_h) {
                        errorData = { message: errorText };
                    }
                    // Check if user already exists error
                    if (((_e = errorData.message) === null || _e === void 0 ? void 0 : _e.includes('already registered')) ||
                        ((_f = errorData.message) === null || _f === void 0 ? void 0 : _f.includes('User already registered')) ||
                        createResponse.status === 422) {
                        console.log("\u2705 Admin user already exists in remote database!");
                        console.log("   Email: ".concat(ADMIN_EMAIL));
                        console.log("\n💡 If you need to reset the password:");
                        console.log("   1. Go to: https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/auth/users");
                        console.log("   2. Find the user and click 'Reset Password'\n");
                        return [2 /*return*/];
                    }
                    throw new Error(errorData.message || "HTTP ".concat(createResponse.status, ": ").concat(createResponse.statusText));
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_1 = _g.sent();
                    console.error("\n❌ Error creating admin user:");
                    if (error_1 instanceof Error) {
                        console.error("   Message: ".concat(error_1.message));
                        if ('status' in error_1) {
                            console.error("   Status: ".concat(error_1.status));
                        }
                        if ('statusText' in error_1) {
                            console.error("   Status Text: ".concat(error_1.statusText));
                        }
                    }
                    else if (typeof error_1 === 'object' && error_1 !== null) {
                        console.error("   Error details:", JSON.stringify(error_1, null, 2));
                    }
                    else {
                        console.error("   Unknown error:", error_1);
                    }
                    console.error("\n💡 Troubleshooting:");
                    console.error("   - Verify NEXT_PUBLIC_SUPABASE_URL is correct:", supabaseUrl);
                    console.error("   - Check that SUPABASE_SERVICE_ROLE_KEY is valid for this project");
                    console.error("   - Ensure the service role key has not expired");
                    console.error("   - Try getting a fresh service role key from:");
                    console.error("     https://supabase.com/dashboard/project/iqliznhufqcwughxydwi/settings/api");
                    console.error("\n📝 Note: The admin user may already exist in the remote database.");
                    console.error("   Check the Supabase Dashboard → Authentication → Users");
                    console.error("   If the user exists, you can reset the password there.\n");
                    // Don't exit with error code if it's a 500 - user might already exist
                    if (error_1 instanceof Error && 'status' in error_1 && error_1.status === 500) {
                        console.log("⚠️  Supabase Auth API returned 500 error.");
                        console.log("   This often means the user already exists or there's a temporary API issue.");
                        console.log("   Please verify the user in the Supabase Dashboard.\n");
                    }
                    process.exit(1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
createAdminUser();
