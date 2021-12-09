<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <div class="column">
        <div class="self-center">
          <q-btn color="primary" label="添加"/>
          <q-btn color="primary" label="编辑"/>
          <q-btn color="primary" label="删除" @click="deleteSelected"/>
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          title="资产"
          :rows="assets"
          :columns="columns"
          selection="single"
          v-model:selected="selected"
          row-key="id"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BACKEND } from 'src/consts';
import { getToken } from 'components/util';
import { PamsAsset, PamsResponse, PamsResponseCode } from 'components/models';
import { Notify } from 'quasar';


export default defineComponent({
  name: 'PageAsset',
  data() {
    return {
      columns: [
        { name: 'id', label: '资产编号', field: 'id', sortable: true },
        { name: 'label', label: '标签', field: 'label', sortable: true },
        { name: 'desc', label: '价值', field: 'value', sortable: true },
        { name: 'desc', label: '介绍', field: 'description' }
      ],
      assets: [] as PamsAsset[],
      selected: [] as PamsAsset[]
    }
  },
  methods: {
    deleteSelected() {
      if (this.selected.length > 0) {
        const id = this.selected[0].id;
        fetch(`${BACKEND}/api/asset/delete/${id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Token': getToken()
          },
        }).then(r => r.json()).then(d => {
          let resp = d as PamsResponse<undefined>;
          Notify.create(`删除结果：${resp.msg}`);
          this.updateList();
        }).catch(e => console.error(e));
      } else {
        Notify.create('请选中要删除的项目');
      }
    },
    updateList() {
      fetch(`${BACKEND}/api/asset/list`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Token': getToken()
        },
      }).then(r => r.json()).then(d => {
        let resp = d as PamsResponse<PamsAsset[]>;
        if (resp.code == PamsResponseCode.ERR) {
          Notify.create(`获取列表时出现错误：${resp.msg}`);
        } else if (resp.data) {
          this.assets = resp.data;
        }
      }).catch(e => console.error(e));
    }
  },
  mounted() {
    this.updateList();
  }
});
</script>
