<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <q-input :model-value="id" label="资产编号" disable/>
        <q-input v-model="labeli" label="标签" :disable="!editable"/>
        <q-input v-model="valuei" label="价值" :disable="!editable"/>
        <q-input v-model="desci" label="简介" :disable="!editable"/>
        <q-input v-model="amounti" label="数量" :disable="!isAdd"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="确定" @click="onOk"/>
        <q-btn color="primary" label="取消" @click="onCancelClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    title: String,
    isAdd: Boolean,
    editable: Boolean,
    id: String,
    value: String,
    desc: String,
    label: String,
    amount: String,
  },

  emits: [
    ...useDialogPluginComponent.emits
  ],

  data() {
    return {
      valuei: '',
      desci: '',
      labeli: '',
      amounti: '',
    }
  }, //傻逼vue

  mounted() {
    this.valuei = this.$props.value;
    this.desci = this.$props.desc;
    this.labeli = this.$props.label;
    this.amounti = this.$props.amount;
  },

  methods: {
    onOk() {
      this.onDialogOK({value: this.valuei, desc: this.desci, label: this.labeli, amount: this.amounti});
    }
  },

  setup() {
    const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

    return {
      dialogRef,
      onDialogOK,
      onDialogHide,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
