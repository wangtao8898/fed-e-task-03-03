<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3" required></textarea>
      </div>
      <div class="card-footer">
        <img v-if="user" :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="article.disablePost">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="(comment, i) in comments" :key="comment.id">
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
        <span class="mod-options" v-if="user && comment.author.username === user.username" @click="deleteComment(comment, i)">
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleComments, addArticleComment, deleteArticleComment } from '@/api/article'
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
    async onSubmit () {
      this.article.disablePost = true
      if (!this.user) {
        this.$router.push('/login')
        return
      }
      const { data } = await addArticleComment(this.article.slug, this.comment)
      this.comment.body = ''
      this.comments = [data.comment, ...this.comments]
      this.article.disablePost = false
    },
    // 删除评论
    async deleteComment (comment, i) {
      await deleteArticleComment(this.article.slug, comment.id)
      this.comments.splice(i, 1)
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped>

</style>