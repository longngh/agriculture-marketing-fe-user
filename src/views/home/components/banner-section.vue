<template>
  <div>
    <vueper-slides
      slide-image-inside
      autoplay
      fixed-height="480px"
      :dragging-distance="100"
      lazy
      lazy-load-on-drag
    >
      <vueper-slide
        v-for="(banner, i) in homeStore.banners"
        :key="i"
        :image="banner"
      >
        <template #loader>
          <i class="icon icon-loader spinning"></i>
          <span>Loading...</span>
        </template>
      </vueper-slide>
    </vueper-slides>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { homeStore } from "../store/home-store";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
export default {
  components: {
    VueperSlides,
    VueperSlide,
  },
  computed: {
    ...mapStores(homeStore),
  },
  data() {
    return {
      banners: [
        {
          image: require("@/assets/components/home/banner1.webp"),
          link: "",
        },
        {
          image: require("@/assets/components/home/banner.webp"),
          link: "",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.banner-section {
  height: calc(100vh - 64px) !important;
}
.left-section-image {
  background: url("@/assets/components/landing/section1-left.webp") !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center 80% !important;
}
.left-section-bg {
  background: var(--v-primary10-base) !important;
}
.banner-img {
  max-height: calc(100vh - 64px) !important;
}
.content {
  max-width: 860px !important;
}
.mobile-section {
  height: 420px !important;
}
.tablet-subtitle {
  max-width: 560px;
}
.inherit-height {
  height: inherit;
}
</style>
