import Vue from 'vue'
import Router from 'vue-router'
import InfoPage from '@/components/pages/Info'
import ApplicationPage from '@/components/pages/Application'
import VotePage from '@/components/pages/Vote'
import ResultPage from '@/components/pages/Result'
import Dashboard from '@/components/pages/TeacherDashboard'
import ElectionCreation from '@/components/pages/ElectionCreation'
import ElectionSelection from '@/components/pages/ElectionSelection'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Initial',
      component: ElectionSelection
    },
    {
      path: '/reroute/:electionId',
      name: 'Reroute',
      component: InfoPage
    },
    {
      path: '/info/:electionId',
      name: 'Info',
      component: InfoPage,
      canReuse: false
    },
    {
      path: '/application/:electionId',
      name: 'Application',
      component: ApplicationPage
    },
    {
      path: '/voting/:electionId',
      name: 'Vote',
      component: VotePage
    },
    {
      path: '/results/:electionId',
      name: 'Results',
      component: ResultPage
    },
    {
      path: '/teacherDashboard/:electionId',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/electionCreation',
      name: 'ElectionCreation',
      component: ElectionCreation
    },
    {
      path: '/electionSelection',
      name: 'ElectionSelection',
      component: ElectionSelection
    }
  ]
})
