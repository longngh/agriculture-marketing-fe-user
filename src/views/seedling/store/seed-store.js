import { defineStore } from "pinia";
import { Seed, SeedCategory } from "@/plugins/api.js";
import loading from "@/plugins/loading";
import alert from "@/plugins/alert";
import { get } from "lodash";

export const seedStore = defineStore("seed", {
  state: () => ({
    seedPage: 1,
    seedsPerPage: 12,
    categories: [],
    seed: {},
    seeds: [],
    searchKey: "",
    filterCategory: [],
    filterPrice: [],
    sortBy: "",
  }),
  getters: {
    slicedSeeds() {
      if (!this.seeds || this.seeds.length == 0) return [];
      return this.filteredSeeds.slice(
        (this.seedPage - 1) * this.seedsPerPage,
        this.seedPage * this.seedsPerPage
      );
    },
    filteredSeeds() {
      if (!this.seeds || this.seeds.length == 0) return [];
      let filtered = this.sortedSeeds;
      if (this.searchKey)
        filtered = filtered.filter(
          (seed) =>
            seed.name
              .toLowerCase()
              .includes(this.searchKey.trim().toLowerCase()) ||
            seed.code
              .toLowerCase()
              .includes(this.searchKey.trim().toLowerCase()) ||
            seed.origin
              .toLowerCase()
              .includes(this.searchKey.trim().toLowerCase())
        );
      if (this.filterCategory && this.filterCategory.length > 0) {
        filtered = filtered.filter((seed) =>
          this.filterCategory.includes(seed.seedCategory.id)
        );
      }
      if (this.filterPrice && this.filterPrice.length > 0) {
        filtered = filtered.filter((seed) => {
          if (!seed.price || +seed.price < 0) return false;
          if (
            this.filterPrice.includes("lowerThan500k") &&
            +seed.price < 500000
          )
            return true;
          if (
            this.filterPrice.includes("between500kAnd1mil") &&
            +seed.price >= 500000 &&
            +seed.price < 1000000
          )
            return true;
          if (
            this.filterPrice.includes("between1mAnd5mil") &&
            +seed.price >= 1000000 &&
            +seed.price < 5000000
          )
            return true;
          if (this.filterPrice.includes("over5mil") && +seed.price >= 5000000)
            return true;
          return false;
        });
      }

      return filtered;
    },
    sortedSeeds() {
      if (!this.seeds || this.seeds.length == 0) return [];
      let sortedSeeds = this.seeds;
      if (!this.sortBy) return sortedSeeds;
      switch (this.sortBy) {
        case "name:asc":
          sortedSeeds.sort((a, b) => a.name.localeCompare(b.title));
          break;
        case "name:desc":
          sortedSeeds.sort((a, b) => b.name.localeCompare(a.title));
          break;
        default:
        case "newest":
          sortedSeeds.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          sortedSeeds.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "price:asc":
          sortedSeeds.sort((a, b) => a.price - b.price);
          break;
        case "price:desc":
          sortedSeeds.sort((a, b) => b.price - a.price);
          break;
      }
      return sortedSeeds;
    },
    totalSeedPage() {
      if (!this.seeds || this.filteredSeeds.length == 0) return 1;
      if (this.filteredSeeds.length % this.seedsPerPage == 0)
        return this.filteredSeeds.length / this.seedsPerPage;
      else return Math.floor(this.filteredSeeds.length / this.seedsPerPage) + 1;
    },
    totalFilteredSeed() {
      if (!this.seeds || this.seeds.length == 0) return 0;
      return this.filteredSeeds.length;
    },
    totalSeed() {
      if (!this.seeds || this.filteredSeeds.length == 0) return 0;
      return this.seeds.length;
    },
  },
  actions: {
    resetFilter() {
      this.searchKey = "";
      this.filterCategory = [];
      this.filterPrice = [];
    },
    async fetchSeeds() {
      try {
        loading.show();
        const res = await Seed.fetch({
          populate: "*",
        });
        if (!res) {
          alert.error(
            "Error occurred when fetching seeds!",
            "Please try again later!"
          );
          return;
        }
        const seeds = get(res, "data.data", []);
        if (!seeds && seeds.length == 0) return;
        const mappedSeeds = seeds.map((seed) => {
          return {
            id: seed.id,
            ...seed.attributes,
            seedCategory: {
              id: get(seed, "attributes.seedlingCategory.data.id", -1),
              ...get(seed, "attributes.seedlingCategory.data.attributes", {}),
            },
            author: get(seed, "attributes.user.data.attributes", {}),
          };
        });
        this.seeds = mappedSeeds;
      } catch (error) {
        alert.error("Error occurred!", error.message);
      } finally {
        loading.hide();
      }
    },
    async fetchCategories() {
      try {
        loading.show();
        const res = await SeedCategory.fetch();
        if (!res) {
          alert.error(
            "Error occurred when fetching seed categories!",
            "Please try again later!"
          );
          return;
        }
        const categories = get(res, "data.data", []);
        if (!categories && categories.length == 0) return;
        const mappedCategories = categories.map((category) => {
          return {
            id: category.id,
            name: get(category, "attributes.name", "Category Name"),
          };
        });
        this.categories = mappedCategories;
      } catch (error) {
        alert.error("Error occurred!", error.message);
      } finally {
        loading.hide();
      }
    },
    async fetchSeed(seedCode) {
      try {
        loading.show();
        const res = await Seed.fetch({
          populate: "*",
          filters: {
            code: seedCode,
          },
        });
        if (!res) {
          alert.error(`Error occurred! Please try again later!`);
          return;
        }
        const seeds = get(res, "data.data", []);
        if (!seeds || seeds.length == 0) return;
        this.seed = {
          id: seeds[0],
          ...seeds[0].attributes,
        };
        this.seed.seedCategory = get(
          this.seed,
          "seedCategory.data.attributes.name",
          "---"
        );
        this.seed.user = get(this.seed, "user.data.attributes");
      } catch (error) {
        console.error(`Error: ${error}`);
        alert.error(error);
      } finally {
        loading.hide();
      }
    },
  },
});
/* eslint-enable */
