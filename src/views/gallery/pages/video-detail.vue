<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div
      class="neutral60--text font-weight-semibold text-sm d-flex flex-wrap py-3 breadcrumb full-width"
      :class="$vuetify.breakpoint.smAndDown ? 'px-6' : 'px-11'"
    >
      <div class="cursor-pointer" @click="$router.push('/')">Trang chủ</div>
      <span class="mx-2">/</span>
      <div class="cursor-pointer" @click="$router.push('/thu-vien-anh')">
        Thư viện Ảnh
      </div>
      <span class="mx-2">/</span>
      <div class="primary--text text-none">
        {{ galleryStore.post.title || "Tiêu đề" }}
      </div>
    </div>
    <div class="page-container mx-auto pa-8">
      <div
        class="text-center font-weight-bold"
        :class="$vuetify.breakpoint.smAndDown ? 'text-xl' : 'text-dp-sm'"
      >
        {{ galleryStore.post.title || "Tiêu đề" }}
      </div>
      <div
        class="mt-4 d-flex flex-column align-center justify-center border-radius-8 overflow-hidden"
        v-if="!galleryStore.post.videoContent.includes('youtube')"
      >
        <video width="100%" :src="galleryStore.post.videoContent" controls>
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        class="mt-4 d-flex flex-column align-center justify-center border-radius-8 overflow-hidden"
        v-else
      >
        <LazyYoutube maxWidth="100%" :src="galleryStore.post.videoContent">
          Your browser does not support the video tag.
        </LazyYoutube>
      </div>
      <v-divider class="mt-8"></v-divider>

      <v-row class="mt-6">
        <v-col cols="12" md="8">
          <div
            class="font-weight-semibold text-xl"
            v-if="!$vuetify.breakpoint.smAndDown"
          >
            {{ galleryStore.post.title || "Tiêu đề" }}
          </div>
          <div
            class="d-flex justify-space-between"
            :class="{ 'mt-2': !$vuetify.breakpoint.smAndDown }"
          >
            <div>
              <div class="neutral60--text font-weight-medium">
                <v-icon class="mr-2" color="primary" small>mdi-account</v-icon
                >{{ galleryStore.post.author }}
              </div>
              <div class="neutral60--text font-weight-medium mt-2">
                <v-icon class="mr-2" color="primary" small
                  >mdi-clock-outline</v-icon
                >{{ galleryStore.post.createdAt | ddmmyyyyhhmmss }}
              </div>
            </div>
            <div class="d-flex">
              <v-btn
                color="primary"
                icon
                @click="copyURL(galleryStore.post.videoContent)"
                ><v-icon>mdi-clipboard-text-outline </v-icon></v-btn
              >
              <v-btn color="primary" icon><v-icon>mdi-facebook</v-icon></v-btn>
              <v-btn color="primary" icon><v-icon>mdi-email</v-icon></v-btn>
            </div>
          </div>
          <div class="mt-6" v-html="galleryStore.post.content"></div>
        </v-col>
        <v-col cols="12" md="4">
          <v-divider
            class="mb-4"
            v-if="$vuetify.breakpoint.smAndDown"
          ></v-divider>
          <div class="font-weight-semibold text-xl">Album ảnh khác</div>
          <div
            class="d-flex mt-4"
            v-for="post in galleryStore.posts"
            :key="post.id"
          >
            <v-img
              class="post-img border-radius-8 cursor-pointer flex-grow-1"
              :src="post.images"
            />
            <v-clamp class="font-weight-semibold text-md ml-2" :max-lines="3">{{
              post.title
            }}</v-clamp>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { galleryStore } from "../stores/galleryStore";
import VClamp from "vue-clamp";
import { LazyYoutube } from "vue-lazytube";
export default {
  computed: {
    ...mapStores(galleryStore),
    postImage() {
      if (!this.galleryStore.post || !this.galleryStore.post.images)
        return require("@/assets/no-image.webp");
      return this.galleryStore.post.images;
    },
  },
  components: {
    // NewCard: () => import("../components/image-card.vue"),
    VClamp,
    LazyYoutube,
  },
  data() {
    return {
      sort: [
        {
          value: "asc",
          name: "Gần nhất",
        },
        {
          value: "desc",
          name: "Cũ nhất",
        },
      ],
    };
  },
  watch: {
    "$route.params.code": {
      async handler() {
        await this.loadDetail();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    gotoListNews() {
      this.$router.push(`/thu-vien-anh`);
    },
    async loadDetail() {
      const code = this.$route.params.code;
      await this.galleryStore.fetchPost(code);
      await this.galleryStore.fetchPosts({
        pagination: {
          page: 1,
          pageSize: 5,
        },
      });
    },
    async copyURL(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        alert("Copied");
      } catch ($e) {
        alert("Cannot copy");
      }
    },
  },
};
</script>

<style scoped>
.active {
  color: white !important;
  background-color: var(--v-primary50-base);
}
.card {
  width: 470px;
  height: 320px;
}
.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 100px !important;
}
.post-img {
  width: 144px !important;
  height: 81px !important;
}
.title {
  color: var(--v-green70-base);
}
</style>
