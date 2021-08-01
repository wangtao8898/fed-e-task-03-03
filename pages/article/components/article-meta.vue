<template>
  <div class="article-meta">
    <nuxt-link :to="{path: '/profile/' + article.author.username}"><img :src="article.author.image" /></nuxt-link>
    <div class="info">
      <nuxt-link :to="{path: '/profile/' + article.author.username}" class="author">{{ article.author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{active: article.author.following}"
      @click="onFollow(article)"
      :disabled="article.disableFollow"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow {{ article.author.username }}
    </button>
    &nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{active: article.favorited}"
      @click="onFavorite(article)"
      :disabled="article.disableFavorite"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { follow, unFollow } from '@/api/user'
import { addFavorite, deleteFavorite } from '@/api/article'

export default {
  name: "ArticleMeta",
  props: ['article'],
  methods: {
    // 关注/取消关注
    async onFollow (article) {
      article.disableFollow = true
      const { author } = article
      if (author.following) {
        await unFollow(author.username)
        author.following = false
      } else {
        await follow(author.username)
        author.following = true
      }
      article.disableFollow = false
    },
    // 点赞/取消点赞
    async onFavorite (article) {
      article.disableFavorite = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount --
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount ++
      }
      article.disableFavorite = false
    }
  }
}
</script>

<style scoped>

</style>