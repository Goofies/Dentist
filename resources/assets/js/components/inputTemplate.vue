<template>
    <div class="form-control">
        <div class="form-group"
            :class="{active: data.isActive, haserror: data.error}">
            <div class="form-label"
                :class="{active: data.isActive || data.value}">
                    {{data.label | titleCase}}:
            </div>
            <!-- Text Input -->
            <input class="form-input" 
                type="text"
                v-if="data.type == 'text' || ''"
                v-model="data.value" 
                @focus="data.isActive = true"
                @blur="data.isActive = false"
                @keydown="data.error = ''" />
            <!-- Number Input -->
            <input class="form-input" 
                type="number"
                v-else-if="data.type == 'number'"
                v-model="data.value" 
                @focus="data.isActive = true"
                @blur="data.isActive = false"
                @keydown="data.error = ''" />
            <!-- Password Input -->
            <input class="form-input" 
                type="password"
                v-else-if="data.type == 'password'"
                v-model="data.value" 
                @focus="data.isActive = true"
                @blur="data.isActive = false"
                @keydown="data.error = ''" />
            <!-- Email Input -->
            <input class="form-input" 
                type="email"
                v-else-if="data.type == 'email'"
                v-model="data.value" 
                @focus="data.isActive = true"
                @blur="data.isActive = false"
                @keydown="data.error = ''" />
            <!-- Textarea Input -->
            <textarea class="form-input" 
                v-else-if="data.type == 'textarea'"
                v-model="data.value" 
                @focus="data.isActive = true"
                @blur="data.isActive = false"
                @keydown="data.error = ''">
            </textarea>
            <span class="form-error">
                {{data.error | capitalize}}
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['data'],
        filters: {
            capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            titleCase(string) {
                return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }
        }
    }
</script>
<style lang="sass" scoped>
    @import "variables.sass"
    .form-control
        padding: 10px 0px
        position: relative
        z-index: 1
        .form-group
            position: relative
            width: 100%
            border-bottom: 2px solid $b200
            margin-top: 16px
            &:after
                content: ''
                position: absolute
                height: 2px
                width: 0%
                bottom: -2px
                left: 0
                background-color: $t800
                -webkit-box-shadow: 0px 0px 10px 0px $t800
                -moz-box-shadow: 0px 0px 10px 0px $t800
                box-shadow: 0px 0px 10px 0px $t800
                transition: 400ms ease-in-out
            .form-label
                position: absolute
                left: 5px
                z-index: -1
                color: $b200
                letter-spacing: 2.5px
                transition: 400ms ease-in-out
                &.active
                    transform: translateY(-100%)
                    color: $t800
                    letter-spacing: 0px
                    font-size: 14px
            .form-input
                padding: 5px
                width: 100%
                box-sizing: border-box
            .form-error
                position: absolute
                bottom: 0
                transform: translateY(100%)
                font-size: 14px
                color: $r700
                transition: 400ms ease-in-out
                opacity: 0
            &.active
                &:after
                    width: 100%
                    -webkit-box-shadow: 0px 0px 10px 0px $t800
                    -moz-box-shadow: 0px 0px 10px 0px $t800
                    box-shadow: 0px 0px 10px 0px $t800
            &.haserror
                &:after
                    width: 100%
                    background-color: $r700
                    -webkit-box-shadow: 0px 0px 10px 0px $r700
                    -moz-box-shadow: 0px 0px 10px 0px $r700
                    box-shadow: 0px 0px 10px 0px $r700
                .form-error
                    opacity: 1
</style>