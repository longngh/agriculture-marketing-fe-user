import axios from "axios";
import utils from "@/plugins/utils";

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;
// axios.defaults.baseURL = "https://neobank-dev-api.capylabs.io/api/";

const USER_API = "/users/";
const POST_API = "/posts/";
const PRODUCT_API = "/products/";
const SEED_API = "/seedlings/";
const SUPPLY_CATEGORY_API = "/supply-categories/";
const SUPPLY_API = "/supplies/";
const PRODUCT_CATEGORY_API = "/product-categories/";
const POST_CATEGORY_API = "/post-categories/";
const SEED_CATEGORY_API = "/seedling-categories/";
const FAQ_CATEGORY_API = "/faq-categories/";
const FAQ_API = "/faqs/";
const DOCUMENT_CATEGORY_API = "/document-categories/";
const DOCUMENT_API = "/documents/";
const CONTACT_API = "/contacts/";

const APIHelper = (api) => ({
  search: (params, option) =>
    axios.get(api, { params: utils.filterObject(params) }, option),
  count: (params, option) =>
    axios.get(api + "count", { params: utils.filterObject(params) }, option),
  fetch: (params, option) =>
    axios.get(api, { params: utils.filterObject(params) }, option),
  fetchOne: (id, params, option) =>
    axios.get(api + id, { params: utils.filterObject(params) }, option),
  create: (params, options) =>
    axios.post(api, utils.filterObject(params), options),
  update: (id, params, option) =>
    axios.put(api + id, utils.filterObject(params), option),
  remove: (id, option) => axios.delete(api + id, option),
});
export const APIRespository = APIHelper;
export const Auth = {
  signIn: (signInData) => axios.post("/admin/auth", signInData),
};

export const User = {
  ...APIHelper(USER_API),
};
export const Category = {};
export const Post = {
  ...APIHelper(POST_API),
};
export const FAQ = {
  ...APIHelper(FAQ_API),
};
export const FAQCategory = {
  ...APIHelper(FAQ_CATEGORY_API),
};
export const Contact = {
  ...APIHelper(CONTACT_API),
};
export const Document = {
  ...APIHelper(DOCUMENT_API),
};
export const DocumentCategory = {
  ...APIHelper(DOCUMENT_CATEGORY_API),
};
export const Product = {
  ...APIHelper(PRODUCT_API),
};
export const ProductCategory = {
  ...APIHelper(PRODUCT_CATEGORY_API),
};
export const PostCategory = {
  ...APIHelper(POST_CATEGORY_API),
};
export const Seed = {
  ...APIHelper(SEED_API),
};
export const SeedCategory = {
  ...APIHelper(SEED_CATEGORY_API),
};
export const Supply = {
  ...APIHelper(SUPPLY_API),
};
export const SupplyCategory = {
  ...APIHelper(SUPPLY_CATEGORY_API),
};
