<template>
    <button class="btn" :class="Bclass" @click="clicked">
        <span :style="click.style" class="btn-click" :class="{animate: click.animate}" ></span>
        <button type="submit">{{Blabel}}</button>
    </button>
</template>
<script>
    export default {
        props: ['Blabel', 'Bclass'],
        methods: {
            clicked(i) {
                this.click.style.top = i.offsetY+'px';
                this.click.style.left = i.offsetX+'px';
                this.click.animate = false;
                setTimeout(() => {
                    this.click.animate = true;
                },1)
            }
        },
        data() {
            return {
                click: {
                    style:{
                        top: '',
                        left: ''
                    },
                    animate: false
                }
            }
        }
    }
</script>
<style scoped lang="sass">
    @import "variables.sass"
    /* Lutfu Can (1:03 μμ): */
    .btn
        position: relative
        background-color: $b100
        font-weight: bold
        -webkit-box-shadow: 0px 1px 2px 0px #000000
        -moz-box-shadow: 0px 1px 2px 0px #000000
        box-shadow: 0px 1px 2px 0px #000000
        border-radius: 2px
        transition: 200ms ease-in-out
        overflow: hidden
        padding: 0
        margin-top: 10px
        .btn-click
            content: ''
            position: absolute
            transform: translateX(-50%) translateY(-50%)
            border-radius: 50%
            background-color: rgba(1,1,1,0.3)
            opacity: 0
            z-index: 1
            &.animate
                animation: blouloup 500ms ease-in-out forwards
        button
            position: relative
            display: inline-block
            padding: 6px 21px
            z-index: 2
            width: 100%
            height: 100%
            box-sizing: border-box
            &:hover
                cursor: pointer
        &:hover
            -webkit-box-shadow: 0px 2px 5px 0px #000000
            -moz-box-shadow: 0px 2px 5px 0px #000000
            box-shadow: 0px 2px 5px 0px #000000
        &:active
            -webkit-box-shadow: 0px 1px 1px 0px #000000
            -moz-box-shadow: 0px 1px 1px 0px #000000
            box-shadow: 0px 1px 1px 0px #000000
        &.btn-success
            background-color: $t500
            color: $b50
        &.btn-danger
            background-color: $r500
            color: $b50
        &.btn-block
            width: 100%
    @keyframes blouloup
        0%
            width: 0%
            padding-bottom: 0%
            opacity: 1
        100%
            width: 300%
            padding-bottom: 300%
            opacity: 0
</style>