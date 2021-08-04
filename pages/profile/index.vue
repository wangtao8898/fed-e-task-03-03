<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{active: profile.following}"
              @click="isSelf ? onEditProfile() : onFollow(profile)"
              :disabled="profile.isDisabled"
            >
              <div v-if="isSelf"><i class="ion-gear-a"></i>&nbsp; Edit Profile Settings</div>
              <div v-else><i class="ion-plus-round"></i>&nbsp; Follow {{ profile.username }}</div>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'my_articles'}"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: tab === 'favorited_articles'}"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'favorited_articles'
                    }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{path: '/profile/' + article.author.username}"><img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link :to="{path: '/profile/' + article.author.username}" class="author">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{active: article.favorited}"
                @click="onFavorite(article)"
                :disabled="article.disableFavorite"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{path: '/article/' + article.slug}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li class="page-item" v-for="item in totalPage" :key="item" :class="{active: item === page}">
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      page: item,
                      tab
                    }
                  }"
                >
                  {{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile, follow, unFollow } from '@/api/user'
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: "Profile",
  watchQuery: ['page', 'tab'],
  middleware: 'notLoginAuth',
  async asyncData ({ params, query }) {
    const { page: queryPage, tab = 'my_articles' } = query
    const page = Number(queryPage || 1)
    const limit = 20
    const queryParams = tab === 'my_articles' ? { author: params.username } : { favorited: params.username }
    const [profileRes, articleRes] = await Promise.all([
      getProfile(params.username),
      getArticles({
        ...queryParams,
        limit,
        offset: (page - 1) * limit,
      })
    ])
    const { profile } = profileRes.data
    profile.isDisabled = false
    const { articles, articlesCount } = articleRes.data
    for (const article of articles) {
      article.disableFavorite = false
    }

    return {
      profile,
      articles,
      articlesCount,
      page,
      limit,
      tab
    }
  },
  computed: {
    ...mapState(['user']),
    // 总页码数
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    isSelf () {
      return this.user && this.profile.username === this.user.username
    }
  },
  methods: {
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
    // 编辑个人资料
    onEditProfile () {
      this.$router.push('/settings')
    },
    // 关注/取消关注
    async onFollow (profile) {
      profile.isDisabled = true
      if (!this.user) {
        this.$router.push('/login')
        return
      }
      if (profile.following) {
        await unFollow(profile.username)
        profile.following = false
      } else {
        await follow(profile.username)
        profile.following = true
      }
      profile.isDisabled = false
    }
  }
}
</script>

<style scoped>

</style>