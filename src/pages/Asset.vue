<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <div class="column">
        <div class="self-center btn-div">
          <q-btn class="action-btn" color="primary" label="添加" @click="addSelected" />
          <q-btn class="action-btn" color="primary" label="编辑" @click="editSelected" />
          <q-btn class="action-btn" color="primary" label="删除" @click="deleteSelected" />
          <q-btn class="action-btn" color="primary" label="入库" @click="inSelected" />
          <q-btn class="action-btn" color="primary" label="出库" @click="outSelected" />
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          title="货品"
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
<style>
.action-btn {
  margin-right: 4px;
  margin-left: 4px;
}

.btn-div {
  margin-top: 16px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { BACKEND } from 'src/consts';
import { getToken } from 'components/util';
import { PamsAsset, PamsResponse, PamsResponseCode } from 'components/models';
import { Notify } from 'quasar';
import AssetDialog from 'components/AssetDialog.vue';


export default defineComponent({
  name: 'PageAsset',
  data() {
    return {
      columns: [
        { name: 'id', label: '货品编号', field: 'id', sortable: true },
        { name: 'label', label: '标签', field: 'label', sortable: true },
        { name: 'value', label: '价值', field: 'value', sortable: true },
        { name: 'desc', label: '简介', field: 'description' },
        { name: 'amount', label: '库存数', field: 'amount' }
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
    addSelected() {
      this.$q.dialog({
        component: AssetDialog,
        componentProps: {
          title: '添加',
          id: '',
          label: '',
          desc: '',
          value: '',
          amount: '',
          editable: true,
          isAdd: true,
        }
      }).onOk((payload) => {
        fetch(`${BACKEND}/api/asset/add`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Token': getToken()
          },
          body: JSON.stringify(payload)
        }).then(r => r.json()).then(d => {
          let resp = d as PamsResponse<undefined>;
          Notify.create(`添加结果：${resp.msg}`);
          this.updateList();
        }).catch(e => console.error(e));
      });
    },
    editSelected() {
      if (this.selected.length > 0) {
        const data = this.selected[0];
        this.$q.dialog({
          component: AssetDialog,
          componentProps: {
            title: '编辑',
            id: data.id.toString(),
            label: data.label,
            desc: data.description,
            value: data.value.toString(),
            amount: data.amount.toString(),
            editable: true,
            isAdd: false
          }
        }).onOk((payload) => {
          fetch(`${BACKEND}/api/asset/edit/${data.id}`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Token': getToken()
            },
            body: JSON.stringify(payload)
          }).then(r => r.json()).then(d => {
            let resp = d as PamsResponse<undefined>;
            Notify.create(`编辑结果：${resp.msg}`);
            this.updateList();
          }).catch(e => console.error(e));
        });
      } else {
        Notify.create('请选中要删除的项目');
      }
    },
    inSelected() {
      if (this.selected.length > 0) {
        const data = this.selected[0];
        this.$q.dialog({
          component: AssetDialog,
          componentProps: {
            title: '入库',
            id: data.id.toString(),
            label: data.label,
            desc: data.description,
            value: data.value.toString(),
            amount: data.amount.toString(),
            editable: false,
            isAdd: true
          }
        }).onOk((payload) => {
          fetch(`${BACKEND}/api/asset/warehouse/${data.id}`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Token': getToken()
            },
            // eslint-disable-next-line
            body: JSON.stringify({ id: data.id, amount: payload.amount, action: 0 })
          }).then(r => r.json()).then(d => {
            let resp = d as PamsResponse<undefined>;
            Notify.create(`入库结果：${resp.msg}`);
            this.updateList();
          }).catch(e => console.error(e));
        });
      } else {
        Notify.create('请选中要入库的项目');
      }
    },
    outSelected() {
      if (this.selected.length > 0) {
        const data = this.selected[0];
        this.$q.dialog({
          component: AssetDialog,
          componentProps: {
            title: '出库',
            id: data.id.toString(),
            label: data.label,
            desc: data.description,
            value: data.value.toString(),
            amount: data.amount.toString(),
            editable: false,
            isAdd: true
          }
        }).onOk((payload) => {
          fetch(`${BACKEND}/api/asset/warehouse/${data.id}`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Token': getToken()
            },
            // eslint-disable-next-line
            body: JSON.stringify({ id: data.id, amount: payload.amount, action: 1 })
          }).then(r => r.json()).then(d => {
            let resp = d as PamsResponse<undefined>;
            Notify.create(`出库结果：${resp.msg}`);
            this.updateList();
          }).catch(e => console.error(e));
        });
      } else {
        Notify.create('请选中要出库的项目');
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
