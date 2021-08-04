<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <article-meta :article="article" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.body"></div>
          <ul class="tag-list">
            <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <article-comments :article="article" />

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { getArticleDetail } from '@/api/article'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'
import markdownIt from 'markdown-it'

export default {
  name: "Article",
  async asyncData ({ params }) {
    const { data: { article } } = await getArticleDetail(params.slug)
    const md = new markdownIt()
    article.body = md.render(article.body) // 将 markdown 转为 HTML 格式
    article.disableFollow = false
    article.disableFavorite = false
    article.disablePost = false
    return {
      article
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
  // 优化 meta 标签
  head () {
    return {
      title: `${this.article.title} - realworld`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description},
        { hid: 'authorName', name: 'authorName', content: this.article.author.username}
      ]
    }
  }
}
</script>

<style scoped>

</style>