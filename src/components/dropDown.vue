<template>
    <div>
        <div class="select-box" :class="{'invalid': status == 'invalid', 'shadow': status == 'active'}"
             v-click-outside="{
            exclude: '.category, .selected-categories, .selected-category, .selected',
              handler: 'setSearchInactive'
        }"
             @click="setSearchActive"

        >
            <div class="search-selected-block" >
                <div class="small-text">
                    Account category <span class="color-red">*</span>
                </div>
                <div class="search-input" v-if="!selected.length">
                    <input type="text" v-model="searchStr" ref="searchInput"
                           placeholder="Type to search or choose from menu">
                </div>
                <div class="selected-categories" v-else>
                    <div v-for="category in selected" :key="category" @click="removeSelect(category)"
                         class="selected-category">
                        {{category.toUpperCase()}}
                        <font-awesome-icon icon="times"/>
                    </div>
                </div>
                <font-awesome-icon icon="chevron-down" v-if="status == 'inactive' || status == 'invalid'"/>
                <font-awesome-icon icon="chevron-up" v-if="status == 'active'"/>
            </div>
            <div class="category selected"
                 v-show="status == 'active' && categoriesList.length"
                 v-for="(category, index) in selected"
                 :key="category"
                 @click="removeSelect(category)"
                 :style="{ paddingLeft: index * 20 + 15 + 'px' }"
            >
                {{ category }}
                <div class="checkbox selected">
                    <font-awesome-icon icon="check"/>
                </div>
            </div>
            <div class="category"
                 v-show="status == 'active'"
                 v-for="category in categoriesList"
                 :key="category.value"
                 @click="selectCategory(category)"
                 :style="{ paddingLeft: selected.length * 20 + 15 + 'px' }"
            >
                {{ category }}
                <div class="checkbox"></div>
            </div>
            <div class="category not-found"
                 v-show="showNotFound"
            >
                Oops, nothing found
                <div class="clear-entry" @click="clearEntry">clear entry</div>
            </div>
        </div>
        <div class="small-text-below" :class="{'invalid': status == 'invalid'}"
             v-show="showTextBelow">
            <span>{{ textBelow }}</span>
        </div>
    </div>
</template>

<script>
    //import ClickOutside from 'vue-click-outside'

    export default {
        name: "dropDown",
        data() {
            return {
                categories: {
                    'Business': {
                        value: 'business',
                        subCategories: {
                            'Mediсince': {
                                value: 'mediсince',
                                subCategories: {
                                    'Drugs': {
                                        value: 'drugs',
                                    },
                                    'Doctors': {
                                        value: 'doctors',
                                    },
                                    'Hospitals': {
                                        value: 'hospitals',
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Other': {
                                value: 'other'
                            }
                        }

                    },
                    'Sience': {
                        value: 'sience',
                        subCategories: {
                            'Asteroid Mining': {
                                value: 'asteroidMining',
                                subCategories: {
                                    'Veldspar': {
                                        value: 'veldspar',
                                    },
                                    'Spodumain': {
                                        value: 'spodumain',
                                    },
                                    'Scordite': {
                                        value: 'scordite',
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Mars Colonization': {
                                value: 'marsColonization',
                                subCategories: {
                                    'Air': {
                                        value: 'air',
                                    },
                                    'Domes': {
                                        value: 'domes',
                                    },
                                    'Terraforming': {
                                        value: 'terraforming',
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Other': {
                                value: 'other'
                            }
                        }

                    },
                    'Interests': {
                        value: 'interests',
                        subCategories: {
                            'Surfing': {
                                value: 'surfing',
                                subCategories: {
                                    'Swell': {
                                        value: 'swell'
                                    },
                                    'Surfboard': {
                                        value: 'surfboard'
                                    },
                                    'Leash': {
                                        value: 'leash'
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'MTB': {
                                value: 'mtb',
                                subCategories: {
                                    'Downhill': {
                                        value: 'downhill'
                                    },
                                    'Freeride': {
                                        value: 'freeride'
                                    },
                                    'Street': {
                                        value: 'street'
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Other': {
                                value: 'other'
                            }
                        },
                    },
                    'Sience finction': {
                        value: 'sienceFinction',
                        subCategories: {
                            'Fantasy': {
                                value: 'fantasy',
                                subCategories: {
                                    'Kir Bulychev': {
                                        value: 'kirBulychev'
                                    },
                                    'Nick Perumov': {
                                        value: 'nickPerumov'
                                    },
                                    'Strugatskie': {
                                        value: 'strugatskie'
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Future': {
                                value: 'future',
                                subCategories: {
                                    '2100': {
                                        value: '2100'
                                    },
                                    '5000': {
                                        value: '5000'
                                    },
                                    '100000': {
                                        value: '100000'
                                    },
                                    'Other': {
                                        value: 'other'
                                    }
                                }
                            },
                            'Other': {
                                value: 'other'
                            }
                        },
                    },
                    'Other': {
                        value: 'other'
                    }
                },
                status: 'inactive',
                searchStr: '',
                selected: []
            };
        },

        computed: {
            categoriesList() {
                if (this.selected.length) {
                    return this.getSubCategories();
                }
                return this.getCategoriesBySearch(this.categories);
            },
            showNotFound() {
                return this.searchStr.length && !this.selected.length && !this.categoriesList.length && this.status == 'active';
            },
            textBelow() {
                return this.status == 'inactive' ? 'E.g. makeup artist, marketing agency, etc.' : 'Please, select a valid account category'
            },
            showTextBelow () {
                return status == 'inactive' || status == 'invalid' && !this.selected.length;
            }
        },
        components: {},
        methods: {
            setSearchActive() {
                this.status = 'active';
                if (!this.selected.length) {
                    if (this.$refs.searchInput) {
                        this.$refs.searchInput.focus()
                    }

                }
            },
            setSearchInactive() {
                if (!this.categoriesList.length && this.searchStr.length) {
                    this.status = 'invalid';
                } else {
                    this.status = 'inactive';
                }
            },
            getCategoriesBySearch(categories) {
                let result = [];
                for (let key in categories) {
                    if (key.toLowerCase().includes(this.searchStr.toLowerCase())) {
                        result.push(key);
                    }
                    if (categories[key].subCategories && this.searchStr) {
                        result = [...result, ...this.getCategoriesBySearch(categories[key].subCategories)];
                    }
                }

                let unique = new Set(result);
                return [...unique];
            },
            getSubCategories() {
                let categories = this.categories;
                let result = [];
                let found = false;
                this.selected.forEach((category) => {
                    for (let key in categories) {
                        if (key.toLowerCase() == category.toLowerCase()) {
                            if (categories[key].subCategories) {
                                categories = categories[key].subCategories;
                            } else {
                                categories = {};
                            }
                            break;
                        } else if (categories[key].subCategories) {
                            for (let skey in categories[key].subCategories) {
                                if (skey.toLowerCase() == category.toLowerCase()) {
                                    found = true;
                                    if (categories[key].subCategories[skey].subCategories) {
                                        categories = categories[key].subCategories[skey].subCategories;
                                    } else {
                                        categories = {};
                                    }
                                    break;
                                } else if (categories[key].subCategories[skey].subCategories) {
                                    for (let sskey in categories[key].subCategories[skey].subCategories) {
                                        if (sskey.toLowerCase() == category.toLowerCase()) {
                                            categories = {};
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                if (found) {
                                    break;
                                }
                            }
                            if (found) {
                                break;
                            }
                        }
                    }
                })
                for (let key in categories) {
                    result.push(key);
                }
                return result;
            },
            selectCategory(category) {
                this.selected.push(category);
            },
            removeSelect(category) {
                let index = this.selected.indexOf(category);
                this.selected = this.selected.slice(0, index);
                setTimeout(this.setSearchActive());

            },
            clearEntry() {
                this.searchStr = '';
                this.selected = [];
                this.setSearchActive();
            }
        },
    }
</script>

<style scoped>
    .color-red {
        color: #f3728a;
    }

    .select-box {
        background: #FFFFFF;
        border: 1px solid #C0CDD3;
        box-sizing: border-box;
        border-radius: 6px;
        max-width: 401px;
        margin: 0 auto;
        margin-top: 20px;
    }

    .select-box.shadow {
        box-shadow: 0px 5px 25px rgba(42, 52, 61, 0.08);
    }

    .search-selected-block {
        padding: 6px 15px 9px 15px;
        position: relative;
    }

    .small-text {
        font-size: 12px;
        line-height: 17px;
        display: flex;
        align-items: center;
        color: #526C79;
    }

    .search-input input::placeholder {
        color: #526C79;
        opacity: 0.75;
    }

    .search-input input {
        border: none;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        width: 100%;
        outline: none;
        padding: 0px;
    }

    .search-selected-block > svg {
        position: absolute;
        top: calc(50% - 16px / 2 + 0.5px);
        right: 17.5px;
        color: #526C79;
        width: 9px !important;
    }

    .category {
        padding: 16px 15px;
        font-family: Proxima Nova;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        color: #2A363D;
        border-top: 1px solid #C0CDD3;
        position: relative;
    }

    .checkbox {
        background: #FFFFFF;
        border: 1px solid #C0CDD3;
        box-sizing: border-box;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 15px;
    }

    .selected-category {
        font-size: 12px;
        line-height: 17px;
        align-items: center;
        color: #FFFFFF;
        background: #5C94FE;
        border-radius: 10px;
        padding: 2px 10px 1px;
        float: left;
        margin-right: 5px;
    }

    .selected-categories {
        display: flex;
        margin-top: 3px;
        margin-bottom: 1px;
    }

    .selected-category > svg {
        position: relative;
        top: 0.5px;
        padding-left: 2px;
    }

    .checkbox.selected > svg {
        font-size: 10px;
        position: absolute;
        color: #4ED687;
    }

    .checkbox.selected {
        border-color: #4ED687;
        padding: 2px;
    }

    .category.not-found {
        position: relative;
    }

    .clear-entry {
        position: absolute;
        right: 12px;
        color: #5C94FE;
        cursor: pointer;
    }

    .small-text-below span {
        margin-left: 16px;
    }

    .small-text-below {
        max-width: 401px;
        margin: 0 auto;
        font-size: 12px;
        line-height: 17px;
        color: #526C79;
        margin-top: 2px;
    }

    .small-text-below.invalid {
        color: #EF3F61;
    }

    .select-box.invalid {
        border-color: #EF3F61;
    }
</style>