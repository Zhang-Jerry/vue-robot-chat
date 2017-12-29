/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import jQuery from 'jquery';

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
  state: {
    // 当前用户
    user: {
      name: '党员同志',
      img: 'dist/images/1.jpg'
    },
    // 会话列表
    sessions: [{
      id: 1,
      user: {
        name: '党建机器人',
        img: 'dist/images/2.jpeg'
      },
      messages: [{
        content: 'Hi，您好党员同志，我是党建机器人小I，有什么可以帮您？',
        date: now
      }]
    }],
    // 当前选中的会话
    currentSessionId: 1,
    // 过滤出只包含这个key的会话
    filterKey: ''
  },
  mutations: {
    INIT_DATA(state) {
      let data = localStorage.getItem('vue-chat-session');
      if (data) {
        state.sessions = JSON.parse(data);
      }
    },
    // 发送消息
    SEND_MESSAGE({
      sessions,
      currentSessionId
    }, content) {
      let session = sessions.find(item => item.id === currentSessionId);
      session.messages.push({
        content: content,
        date: new Date(),
        self: true
      });
      if (content) {
        let dateObj = {
          question: content
        }
        jQuery.ajax({
          type: 'GET',
          url: 'http://jisuznwd.market.alicloudapi.com/iqa/query',
          data: dateObj,
          // cache: false,
          dataType: 'JSON',
          headers: {
            "Authorization":"APPCODE d4d90e79205047da88f745029d7fb067"
          },
          success: function(data) {
            // if(data && data.type === '1') {
            if (data) {
              session.messages.push({
                content: data.result.content,
                date: new Date(),
                self: false
              });
            } else {
              session.messages.push({
                content: 'Sorry，小I不理解您的意思',
                date: new Date(),
                self: false
              });
            }
          },
          error: function() {
            session.messages.push({
              content: 'Sorry，小I刚刚走神了，请您再问一次',
              date: new Date(),
              self: false
            });
          }
        });
      } else {
        session.messages.push({
          content: '哎呀，别逗我好嘛，聊点啥呗？',
          date: new Date(),
          self: false
        });
      }
      // let dataObj = {
      //   userId: 'pOf8U2ABAAARQAxu70aEX9QUS0nd22JZ',
      //   platform: 'web',
      //   question: content
      // }

    },
    // 选择会话
    SELECT_SESSION(state, id) {
      state.currentSessionId = id;
    },
    // 搜索
    SET_FILTER_KEY(state, value) {
      state.filterKey = value;
    }
  }
});

store.watch(
  (state) => state.sessions,
  (val) => {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
  }, {
    deep: true
  }
);

export default store;
export const actions = {
  initData: ({
    dispatch
  }) => dispatch('INIT_DATA'),
  sendMessage: ({
    dispatch
  }, content) => dispatch('SEND_MESSAGE', content),
  selectSession: ({
    dispatch
  }, id) => dispatch('SELECT_SESSION', id),
  search: ({
    dispatch
  }, value) => dispatch('SET_FILTER_KEY', value)
};
