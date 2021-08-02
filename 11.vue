<template>
  <div>
    <div class="aa">{{ a }}</div>
  </div>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    let a = ref("呵呵222");
    return { a };
  },
});
</script>
