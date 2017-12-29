<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions
    },
    data () {
        return {
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
          var len = this.content.length
            if (e.keyCode === 13 && len) {
                var content = this.content.substring(0, len-1)
                this.sendMessage(content);
                this.content = '';
            }
        }
    }
};
</script>

<template>
<div class="text">
    <textarea placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
</div>
</template>

<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;

    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
}
</style>
