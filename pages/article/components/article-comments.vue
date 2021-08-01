<template>
  <div>
    <form class="card comment-form" @submit.prevent="onsubmit">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="article.disablePost">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{path: '/profile/' + comment.author.username}" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{path: '/profile/' + comment.author.username}" class="comment-author">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleComments, addArticleComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: "ArticleComments",
  props: ['article'],
  data () {
    return {
      comments: [],
      comment: {
        body: ''
      }
    }
  },
  async created () {
    // 获取文章评论
    const { data } = await getArticleComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    // 添加评论
    async onsubmit () {
      this.article.disablePost = true
      const { data } = await addArticleComment(this.article.slug, this.comment)
      this.comment.body = ''
      this.comments.unshift(data.comment)
      this.article.disablePost = false
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped>

</style>