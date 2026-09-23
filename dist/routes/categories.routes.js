"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_js_1 = require("../controller/category.controller.js");
const router = (0, express_1.Router)();
// GET /api/categories - List all categories
router.get("/", category_controller_js_1.getCategories);
// GET /api/categories/:id - Get a single category by ID
router.get("/:id", category_controller_js_1.getCategoryById);
// POST /api/categories - Create a new category
router.post("/", category_controller_js_1.createCategory);
// PUT /api/categories/:id - Update an existing category
router.put("/:id", category_controller_js_1.updateCategory);
// DELETE /api/categories/:id - Delete a category
router.delete("/:id", category_controller_js_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.routes.js.map