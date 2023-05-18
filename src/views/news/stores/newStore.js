import { defineStore } from "pinia";
import { Post } from "@/plugins/api.js";
import loading from "@/plugins/loading";
import alert from "@/plugins/alert";
import { get } from "lodash";

export const newStore = defineStore("new", {
  state: () => ({
    newsPage: 1,
    newsPerPage: 12,
    categories: [],
    news: {},
    listNew: [],
    newPosts: [],
    searchKey: "",
  }),
  getters: {
    slicedlistNew() {
      if (!this.listNew || this.listNew.length == 0) return [];
      return this.filteredlistNew.slice(
        (this.newsPage - 1) * this.newsPerPage,
        this.newsPage * this.newsPerPage
      );
    },
    filteredlistNew() {
      if (!this.listNew || this.listNew.length == 0) return [];
      let filtered = this.listNew;
      if (this.searchKey)
        filtered = filtered.filter(
          (news) =>
            news.title
              .toLowerCase()
              .includes(this.searchKey.trim().toLowerCase()) ||
            news.content
              .toLowerCase()
              .includes(this.searchKey.trim().toLowerCase())
          //   ||
          // news.origin
          //   .toLowerCase()
          //   .includes(this.searchKey.trim().toLowerCase())
        );
      return filtered;
    },
    // sortedCampaigns() {
    //   if (!this.voucherData || this.voucherData.length == 0) return [];
    //   let sortedCampaigns = this.voucherData;
    //   if (!this.sortBy) return sortedCampaigns;
    //   switch (this.sortBy) {
    //     default:
    //     case "asc":
    //       sortedCampaigns.sort((a, b) => a.title.localeCompare(b.title));
    //       break;
    //     case "desc":
    //       sortedCampaigns.sort((a, b) => b.title.localeCompare(a.title));
    //       break;
    //     case "newsest":
    //       sortedCampaigns.sort((a, b) => news Date(b.createdAt).getTime() - news Date(a.createdAt).getTime());
    //       break;
    //     case "oldest":
    //       sortedCampaigns.sort((a, b) => news Date(a.createdAt).getTime() - news Date(b.createdAt).getTime());
    //       break;
    //     case "priceUp":
    //       sortedCampaigns
    //         // .filter((voucher) => voucher.price)
    //         .sort((a, b) => a.price - b.price);
    //       break;
    //     case "priceDown":
    //       sortedCampaigns
    //         // .filter((voucher) => voucher.price)
    //         .sort((a, b) => b.price - a.price);
    //       break;
    //   }
    //   return sortedCampaigns;
    // },
    totalnewsPage() {
      if (!this.listNew || this.filteredlistNew.length == 0) return 1;
      if (this.filteredlistNew.length % this.newsPerPage == 0)
        return this.filteredlistNew.length / this.newsPerPage;
      else
        return Math.floor(this.filteredlistNew.length / this.newsPerPage) + 1;
    },
    totalnews() {
      if (!this.listNew || this.filteredlistNew.length == 0) return 1;
      return this.filteredlistNew.length;
    },
  },
  actions: {
    async fetchlistNew() {
      try {
        loading.show();
        const res = await Post.fetch({
          populate: "postCategory",
        });
        if (!res) {
          alert.error(
            "Error occurred when fetching listNew!",
            "Please try again later!"
          );
          return;
        }
        const listNew = get(res, "data.data", []);
        if (!listNew && listNew.length == 0) return;
        const mappedlistNew = listNew.map((news) => {
          return {
            id: news.id,
            ...news.attributes,
            newsCategory: get(
              news,
              "attributes.postCategory.data.attributes",
              {}
            ),
            author: get(news, "attributes.user.data.attributes", {}),
          };
        });
        this.listNew = mappedlistNew;
      } catch (error) {
        alert.error("Error occurred!", error.message);
      } finally {
        loading.hide();
      }
    },
    async fetchnews(newsCode) {
      try {
        loading.show();
        const res = await Post.fetchOne(newsCode, {
          populate: "postCategory",
          // filters: {
          //   code: newsCode,
          // },
        });
        if (!res) {
          alert.error(`Error occurred! Please try again later!`);
          return;
        }
        const listNew = get(res, "data.data", {});
        if (!listNew || listNew.length == 0) return;
        this.news = {
          id: listNew.id,
          ...listNew.attributes,
          newsCategory: get(
            listNew,
            "attributes.postCategory.data.attributes",
            {}
          ),
        };
        // this.news.newsCategory = get(
        //   this.news,
        //   "newsCategory.data.attributes.name",
        //   "---"
        // );
        // this.news.user = get(this.news, "user.data.attributes");
      } catch (error) {
        console.error(`Error: ${error}`);
        alert.error(error);
      } finally {
        loading.hide();
      }
    },
    async top3NewPost() {
      try {
        loading.show();
        const res = Post.topNewPost();
        if (!res) {
          alert.error(
            "Error occurred when fetching listNew!",
            "Please try again later!"
          );
          return;
        }
        const listNew = get(res, "data.data", []);
        if (!listNew && listNew.length == 0) return;
        const mappedlistNew = listNew.map((news) => {
          return {
            id: news.id,
            ...news.attributes,
            newsCategory: get(
              news,
              "attributes.postCategory.data.attributes",
              {}
            ),
            author: get(news, "attributes.user.data.attributes", {}),
          };
        });
        this.newPosts = mappedlistNew;
      } catch (error) {
        alert.error("Error occurred!", error.message);
      } finally {
        loading.hide();
      }
    },
  },
});
/* eslint-enable */
