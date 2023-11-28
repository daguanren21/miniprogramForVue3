<template>
  <div class="wh-full flex-col overflow-hidden bg-hex-fff">
    <div class="flex-1 overflow-auto">
      <nut-notify
        :type="message.type"
        v-model:visible="message.show"
        :msg="message.desc"
      />
      <nut-form :model-value="form" ref="ruleForm">
        <nut-form-item class="jx-form-item" label="设备编号" required>
          <nut-input
            :border="false"
            max-length="30"
            @blur="getDeviceBySerialNumber"
            v-model="form.serialNumber"
            class="nut-input-text"
            placeholder="请输入设备编号"
            type="text"
          >
            <template #right>
              <jx-icon
                @click.stop="scanAssetNumber"
                value="scandDevice"
                color="#4088FF"
                :size="24"
              >
              </jx-icon>
            </template>
          </nut-input>
        </nut-form-item>
        <nut-form-item class="jx-form-item" label="设备状态" required>
          <nut-radio-group
            direction="horizontal"
            v-model="form.newRunningState"
          >
            <nut-radio label="NORMAL">正常</nut-radio>
            <nut-radio label="ABNORMAL">异常</nut-radio>
          </nut-radio-group>
        </nut-form-item>
        <nut-form-item label="现场图片" required>
          <nut-uploader
            :media-type="['image']"
            @delete="deleteFiles"
            :file-list="_fileList"
            :url="uploadUrl"
            :before-xhr-upload="beforeXhrUpload"
            maximum="4"
          ></nut-uploader>
        </nut-form-item>
        <div class="text-hex-FC0909 text-24px p-x-32px">
          注意：请确保上传现场图片能体现出设备现场情况，以便于我们更好地识别
        </div>
      </nut-form>
    </div>
    <nut-popup
      position="bottom"
      closeable
      round
      :style="{ height: '60%' }"
      v-model:visible="searialNumber.show"
    >
      <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">
        搜索结果
      </div>
      <div class="p-x-40px box-border">
        <div
          class="p-y-40px box-border"
          style="border-bottom: 1rpx solid #dadada"
          v-for="item in deviceList"
          @click="searialNumber.confirm(item)"
        >
          <div class="text-30px font-bold text-hex-333">
            {{ item.serialNumber }}
          </div>
          <div class="mt-20px text-26px text-hex-797979">
            {{ item.brandName }}
          </div>
        </div>
      </div>
    </nut-popup>
    <nut-cell>
      <nut-button
        :disabled="!form.id"
        type="primary"
        class="m-auto"
        style="width: 80%; margin: auto"
        @click="confirm"
        :loading="loading"
        >提交</nut-button
      >
    </nut-cell>
  </div>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { useRouter } from "@tarojs/taro";
import { updateDeviceStateChange } from "~/api/device";
import { useDeviceBySearialNumber } from "~/composables/use-device-searialNumber";
import useLoading from "~/composables/use-loading";
import { useNotify } from "~/composables/use-notify";
import { useUpload } from "~/composables/use-upload";
const route = useRouter();
const form = reactive({
  id: route.params.id || "",
  serialNumber: route.params.serialNumber || "",
  newRunningState: "NORMAL" as Filter.RunningState,
  deployedImagePath: "",
  remarks: "",
});
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form);
const { getDeviceBySerialNumber, searialNumber, deviceList, scanAssetNumber } =
  useDeviceBySearialNumber(form);
const { state: message, notify } = useNotify("danger");
const { loading, startLoading, endLoading } = useLoading();
//提交
const confirm = async () => {
  const { serialNumber } = form;
  if (!serialNumber) {
    notify("设备编号不能为空！");
    return;
  }
  if (!_fileList.length) {
    notify("现场图片至少上传一张！");
    return;
  }
  try {
    startLoading();
    await updateDeviceStateChange({
      deviceId: form.id,
      newRunningState: form.newRunningState,
      imagesPath: _fileList.map((v) => v.url).join(";"),
    });
    Taro.showToast({
      icon: "none",
      title: "状态变更已提交，待审核！",
    });
    setTimeout(() => {
      endLoading();
      Taro.navigateBack({
        delta: 1,
      });
    }, 1000);
  } catch (error) {
    endLoading();
    notify(error);
  }
};
</script>

<style scoped></style>
