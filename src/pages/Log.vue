<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <div class="column">
        <div class="self-center btn-div">
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          title="仓库日志"
          :rows="logs"
          :columns="columns"
          selection="single"
          row-key="id"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PamsLog, PamsResponse, PamsResponseCode } from 'components/models';
import { BACKEND } from 'src/consts';
import { getToken } from 'components/util';
import { Notify } from 'quasar';

type DisplayLog = {
  id: number,
  asset: string,
  message: string,
  user: string,
  action: string,
  amount: number
}

export default defineComponent({
  name: 'PageLog',
  data() {
    return {
      columns: [
        { name: 'id', label: '日志编号', field: 'id', sortable: true },
        { name: 'action', label: '操作', field: 'action' },
        { name: 'user', label: '用户', field: 'user' },
        { name: 'asset', label: '货品', field: 'asset' },
        { name: 'amount', label: '库存变化', field: 'amount' },
        { name: 'message', label: '内容', field: 'message' },
      ],
      logs: [] as DisplayLog[]
    };
  },
  methods: {
    updateList() {
      fetch(`${BACKEND}/api/asset/logs`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Token': getToken()
        },
        body: JSON.stringify({})
      }).then(r => r.json()).then(d => {
        let resp = d as PamsResponse<PamsLog[]>;
        if (resp.code == PamsResponseCode.ERR) {
          Notify.create(`获取列表时出现错误：${resp.msg}`);
        } else if (resp.data) {
          this.logs = [];
          for (let log of resp.data) {
            let action = '未知';
            switch (log.action) {
              case 0:
                action = '入库';
                break;
              case 1:
                action = '出库';
                break;
              case 2:
                action = '修改';
                break;
            }
            this.logs.push({
              id: log.id,
              asset: log.asset.label,
              user: log.user.name,
              amount: log.amount,
              action: action,
              message: log.message
            })
          }
        }
      }).catch(e => console.error(e));
    }
  },
  mounted() {
    this.updateList();
  }
});
</script>
