<template>
  <div class="bg-indigo-100 mt-3 text-left rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
    <div class="justify-around flex-col w-full text-center sm:col-span-2 lg:col-span-1">
      <div class="flex block bg-indigo-300 text-indigo-800 rounded-lg rounded-b-none items-stretch mb-2 lg:rounded-tr-none lg:rounded-br-lg">
        <div class="p-1 flex-1 flex items-center">
          <span class="w-full text-center">
            {{ dragon.name() }} #{{ dragon.id() }}
          </span>
        </div>
        <button @click="$emit('remove')" class="bg-indigo-800 text-indigo-300 rounded-tr-lg p-1 px-5 text-center lg:rounded-tr-none lg:rounded-br-lg lg:p-0 lg:px-2">
          X
        </button>
      </div>
      <div class="p-1 hidden lg:inline-block">
        <img :src="dragon.thumbnailImageUrl()"/>
      </div>
    </div>
    <div class="px-4 lg:p-4 flex items-center">
      {{ dragon.gender() }} {{ dragon.breed() }}<br/>
      {{ dragon.flight() }} {{ dragon.eyes() }}<br/>
      {{ dragon.colorPattern() }} {{ dragon.digits() }} Digits<br/>
    </div>
    <div class="px-4 lg:p-4 flex items-center">
      {{ dragon.primaryColor() }} {{ dragon.primaryGene() }}<br/>
      {{ dragon.secondaryColor() }} {{ dragon.secondaryGene() }}<br/>
      {{ dragon.tertiaryColor() }} {{ dragon.tertiaryGene() }}<br/>
    </div>
    <div class="px-3 mt-2 sm:my-2">
      <input type="text" placeholder="YYYY-MM-DD" v-model="dragon.data.dateOfBirth" class="p-2 block w-full"/>
      <label class="block m-1 bg-indigo-300 text-indigo-800 p-1 px-2 rounded cursor-pointer">
        <input type="checkbox" v-model="dragon.data.isBred" /> Bred
      </label>
      <label class="block m-1 bg-indigo-300 text-indigo-800 p-1 px-2 rounded cursor-pointer">
        <input type="checkbox" v-model="dragon.data.hasSilhouette" /> Silhouette
      </label>
      <label class="block m-1 bg-indigo-300 text-indigo-800 p-1 px-2 rounded cursor-pointer">
        <input type="checkbox" v-model="dragon.data.isPermababy" /> Permabab
      </label>
    </div>
    <div class="p-3">
      <select @change="addTag" ref="tagSelect" class="block p-2 rounded-lg mb-2 w-full">
        <option>Add Tag</option>
        <option v-for="(tag, i) in tags" :key="i">{{tag}}</option>
      </select>
      <label v-for="(tag, i) in dragon.tags()" :key="i" @click="dragon.removeTag(i)" class="block m-1 bg-indigo-300 text-indigo-800 p-2 rounded cursor-pointer">
        {{tag}}
        <span class="float-right">X</span>
      </label>
    </div>
  </div>
</template>

<script>
  import tags from '@/data/tags';
  export default {
    name: 'Dragon',
    props: {
      dragon: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        tags,
      }
    },
    methods: {
      addTag(e) {
        const select = this.$refs.tagSelect;
        const tag = select.options[select.selectedIndex].text;
        if (tag !== 'Add Tag') {
          this.dragon.pushTag(tag);
        }

        select.selectedIndex = 0;
      },
    },
  }
</script>
