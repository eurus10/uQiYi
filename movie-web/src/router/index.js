import Vue from 'vue'
import Router from 'vue-router'
import Movie from '@/components/Movie'
import Player from '@/components/Player'
import MovieQuery from '@/components/MovieQuery'
import RatingQuery from '@/components/RatingQuery'
import Charts from '@/components/Charts'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/movie'
    },
    {
      path: '/movie',
      name: 'Movie',
      component: Movie
    },
    {
      path: '/player',
      name: 'Player',
      component: Player
    },
    {
      path: '/movie_query',
      name: 'MovieQuery',
      component: MovieQuery
    },
    {
      path: '/rating_query',
      name: 'RatingQuery',
      component: RatingQuery
    },
    {
      path: '/charts',
      name: 'Charts',
      component: Charts
    }
  ]
})
