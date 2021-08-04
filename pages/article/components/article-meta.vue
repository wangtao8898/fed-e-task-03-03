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
      @click="isSelf ? onUpdateArticle(article.slug) : onFollow(article)"
      :disabled="article.disableFollow"
    >
      <div v-if="isSelf"><i class="ion-edit"></i>&nbsp; Edit Article</div>
      <div v-else><i class="ion-plus-round"></i>&nbsp; Follow {{ article.author.username }}</div>
    </button>
    &nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{active: article.favorited}"
      @click="isSelf ? onDeleteArticle(article.slug) : onFavorite(article)"
      :disabled="article.disableFavorite"
    >
      <div v-if="isSelf"><i class="ion-trash-a"></i>&nbsp; Delete Article</div>
      <div v-else><i class="ion-heart"></i>&nbsp; Favorite Post <span class="counter">({{ article.favoritesCount }})</span></div>
    </button>
  </div>
</template>

<script>
import { follow, unFollow } from '@/api/user'
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: "ArticleMeta",
  props: ['article'],
  computed: {
    ...mapState(['user']),
    isSelf() {
      return this.user && this.article.author.username === this.user.username
    }
  },
  methods: {
    // 关注/取消关注
    async onFollow (article) {
      article.disableFollow = true
      if (!this.user) {
        this.$router.push('/login')
        return
      }
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
      if (!this.user) {
        this.$router.push('/login')
        return
      }
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
    },
    onUpdateArticle (slug) {
      this.$router.push({ name: 'editor', query: { slug }})
    },
    async onDeleteArticle (slug) {
      article.disableFavorite = true
      await deleteArticle(slug)
      this.$router.push({ name: 'profile', params: { username: this.user.username }})
    }
  }
}
</script>

<style scoped>

</style>