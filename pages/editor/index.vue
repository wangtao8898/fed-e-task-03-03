<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input type="text" v-model="article.title" class="form-control form-control-lg" placeholder="Article Title" required>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" v-model="article.description" class="form-control" placeholder="What's this article about?" required>
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)" required></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input @keyup="onEnterTag" v-model="tag" type="text" class="form-control" placeholder="Enter tags">
                <div class="tag-list">
                  <span class="tag-default tag-pill" v-for="(tag, i) in article.tagList" :key="tag">
                  <i class="ion-close-round" @click="deleteTag(i)"></i>
                  {{ tag }}
                </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
                :disabled="isDisabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { publishArticle, getArticleDetail, updateArticle } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: "Editor",
  middleware: 'notLoginAuth',
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      tag: '',
      isDisabled: false
    }
  },
  async created () {
    if (!this.slug) return
    const { data } = await getArticleDetail(this.slug)
    this.article = data.article
  },
  methods: {
    onEnterTag (e) {
      if (e.keyCode === 13) {
        const validTag = this.tag.trim()
        if (!validTag) return
        this.article.tagList.push(validTag)
        this.tag = ''
      }
    },
    deleteTag (i) {
      this.article.tagList.splice(i, 1)
    },
    async onSubmit () {
      this.isDisabled = true
      this.slug
      ? await updateArticle(this.slug, { article: this.article })
      : await publishArticle({ article: this.article })
      this.$router.push({ name: 'profile', params: { username: this.user.username }})
    }
  },
  computed: {
    ...mapState(['user']),
    slug () {
      return this.$route.query.slug
    }
  }
}
</script>

<style scoped>

</style>