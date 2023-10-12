<template>
  <div class="h-full flex-col overflow-hidden bg-hex-F7F7F7">
    <nut-notify
      :type="message.type"
      v-model:visible="message.show"
      :msg="message.desc"
    />
    <div>
      <div class="tab_wrap pt-29px pb-18px box-border">
        <nut-row>
          <nut-col
            @tap="changeTab(index)"
            v-for="(item, index) in tabList"
            :span="12"
            :key="'tab' + index"
          >
            <div class="tab" :class="{ active: index == tabIndex }">
              <p class="ft">{{ item.text }}清单</p>
              <div
                v-if="index === tabIndex"
                class="mt-10px w-52px h-10px rounded-20px bg-hex-409EFF"
              ></div>
            </div>
          </nut-col>
        </nut-row>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-hidden" v-if="state.totalPage">
        <jx-scroll-view
          class="x-scroll-view"
          :refreshing="refreshing"
          :nomore="nomore"
          @pulldownrefresh="_onPullDownRefresh"
          @loadmore="_onLoadmore"
          @scroll="_onScroll"
        >
          <nut-backtop height="100%">
            <template v-slot:content>
              <div
                class="manage_item"
                v-for="item in state.content"
                :key="item.id"
              >
                <div class="flex">
                  <div class="w-180px h-180px mr-30px">
                    <image
                      class="wh-full"
                      v-if="item.brandLogo"
                      :src="item.brandLogo"
                    ></image>
                    <image
                      class="wh-full"
                      v-else
                      src="../../assets/images/index/默认图.jpg"
                    >
                    </image>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <div class="flex-y-center justify-between">
                      <span class="text-30px text-hex-333 font-bold">{{
                        item.serialNumber
                      }}</span>
                      <span class="text-24px text-hex-999">
                        {{
                          dateFilter(item.exceptionTime, "YYYY-MM-DD HH:mm")
                        }}</span
                      >
                    </div>
                    <div
                      class="mt-30px text-26px"
                      :style="{ color: handleExceptionReason(item.type) }"
                    >
                      {{ item.exceptionReason }}
                    </div>
                  </div>
                </div>
                <div class="flex-y-center justify-between mt-27px">
                  <div class="text-26px text-hex-999">
                    通知次数：{{ item.noticeNumber || 0 }}
                  </div>
                  <div class="flex justify-end">
                    <nut-button
                      class="jx-button"
                      type="primary"
                      @click="noticeModal.open(item)"
                      >通知维护</nut-button
                    >
                    <nut-button
                      style="margin-left: 20rpx"
                      class="jx-button"
                      type="danger"
                      @click="handleModal.open(item)"
                      >处理</nut-button
                    >
                  </div>
                </div>
              </div>
            </template>
          </nut-backtop>
        </jx-scroll-view>
      </div>
      <div class="flex-center h-full overflow-hidden">
        <nut-empty description="暂无数据"></nut-empty>
      </div>
    </div>

    <nut-dialog
      pop-class="form"
      no-cancel-btn
      v-model:visible="noticeModal.show"
      ok-text="通知"
      @ok="noticeModal.confirm"
    >
      <nut-cell>
        <div>
          最后通知时间：{{
            dateFilter(noticeModal.form.lastNoticeTime, "YYYY-MM-DD HH:mm")
          }}
        </div>
      </nut-cell>
      <nut-cell>
        <div>通知内容：{{ noticeModal.form.smsContent }}</div>
      </nut-cell>
    </nut-dialog>
    <nut-popup
      position="bottom"
      closeable
      round
      :style="{ height: '90%' }"
      v-model:visible="handleModal.show"
    >
      <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">
        {{ tabList[tabIndex].text }}设备处理
      </div>
      <div class="w-full flex-col items-center">
        <nut-form :model-value="handleModal.form" ref="ruleForm">
          <nut-form-item class="jx-form-item" label="报修原因">
            <div class="nut-input-text">
              {{ handleModal.form.exceptionReason }}
            </div>
          </nut-form-item>
          <nut-form-item
            v-if="handleModal.form.exceptionCode === 1001"
            class="jx-form-item"
            label="电极片有效期"
            required
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model="handleModal.form.electrodeInvalidDate"
              readonly
              @click="handleChangeDate('electrodeInvalidDate')"
              placeholder="请选择电极片有效期"
              type="text"
            >
              <template #right>
                <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
              </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item
            v-if="handleModal.form.exceptionCode === 1002"
            class="jx-form-item"
            label="电池有效期"
            required
          >
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model="handleModal.form.batteryInvalidDate"
              readonly
              @click="handleChangeDate('batteryInvalidDate')"
              placeholder="请选择电池有效期"
              type="text"
            >
              <template #right>
                <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
              </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item class="jx-form-item" label="处理图片">
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
            注意：请确保上传现场图片能体现出设备现场情况，以便于我们更好地识别和解决问题
          </div>
          <nut-form-item required>
            <div class="w-684px h-256px jx-textarea">
              <nut-textarea
                placeholder="请输入处理描述"
                v-model="handleModal.form.advice"
                limit-show
                max-length="200"
              />
            </div>
          </nut-form-item>
          <nut-popup position="bottom" v-model:visible="datePop.show">
            <nut-date-picker
              v-model="datePop.value"
              @confirm="datePop.methods.confirm"
              @cancel="datePop.show = false"
            >
            </nut-date-picker>
          </nut-popup>
        </nut-form>
        <nut-button
          type="info"
          style="
            width: 550rpx;
            height: 73rpx;
            font-size: 30rpx;
            margin-bottom: 30rpx;
          "
          @click="handleModal.confirm"
          >处理</nut-button
        >
      </div>
    </nut-popup>
  </div>
</template>

<script setup lang="ts">
import {
  DeviceExceptionRecord,
  fetchDeviceExceptionRecords,
  updateNotice,
  updateRepairApplyRecord,
} from "~/api/device";
import { useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { dateFilter } from "~/filter";
import { useUpload } from "~/composables/use-upload";
import { useNotify } from "~/composables/use-notify";
const { state: message, notify } = useNotify("danger");
const state = reactive({
  content: [] as DeviceExceptionRecord[],
  totalCount: 0,
  totalPage: 0,
  page: 1,
});
const tabList = ref<
  {
    key: "ABNORMAL" | "WARNING";
    text: string;
  }[]
>([
  {
    key: "ABNORMAL",
    text: "异常",
  },
  {
    key: "WARNING",
    text: "预警",
  },
]);
const tabIndex = ref<number>(0);
const changeTab = (index) => {
  tabIndex.value = index;
  fetchData();
};
const handleExceptionReason = (state: Filter.RunningState) => {
  if (state === "WARNING") {
    return "#f0a020";
  }
  if (state === "ABNORMAL") {
    return "#EA2E1E";
  }
  return "#ddd";
};
//通知模态框
const noticeModal = reactive({
  show: false,
  form: {
    id: 0,
    smsContent: "",
    lastNoticeTime: "",
  } as DeviceExceptionRecord,
  confirm: async () => {
    try {
      await updateNotice(noticeModal.form.id);
      Taro.showToast({
        icon: "success",
        title: "通知完成！",
      });
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      Taro.showToast({
        icon: "none",
        title: error,
      });
    }
  },
  open: (item: DeviceExceptionRecord) => {
    noticeModal.form = item;
    noticeModal.show = true;
  },
});

//处理模态框
const handleModal = reactive({
  show: false,
  form: {
    id: 0,
    advice: "",
    handleState: "HANDLED",
    exceptionReason: "",
    batteryInvalidDate: "",
    electrodeInvalidDate: "",
    handleImagesPath: "",
    exceptionCode: 0,
  },
  confirm: async () => {
    try {
      handleModal.form.handleImagesPath = _fileList.length
        ? _fileList.map((v) => v.url).join(";")
        : "";
      let applyRecord =
        handleModal.form.exceptionCode === 1001
          ? {
              id: handleModal.form.id,
              advice: handleModal.form.advice,
              handleState: "HANDLED",
              electrodeInvalidDate: handleModal.form.electrodeInvalidDate,
              handleImagesPath: handleModal.form.handleImagesPath,
              exceptionCode: handleModal.form.exceptionCode,
            }
          : {
              id: handleModal.form.id,
              advice: handleModal.form.advice,
              handleState: "HANDLED",
              batteryInvalidDate: handleModal.form.batteryInvalidDate,
              handleImagesPath: handleModal.form.handleImagesPath,
              exceptionCode: handleModal.form.exceptionCode,
            };
      if (!applyRecord.advice) {
        notify("处理描述不能为空！");
        return;
      }
      await updateRepairApplyRecord(applyRecord);
      handleModal.show = false;
      setTimeout(() => {
        Taro.showToast({
          icon: "success",
          title: "处理完成！",
        });
        fetchData();
      }, 1000);
    } catch (error) {
      Taro.showToast({
        icon: "none",
        title: error,
      });
    }
  },
  open: (item: DeviceExceptionRecord) => {
    handleModal.form.id = item.id;
    handleModal.form.batteryInvalidDate = dateFilter(
      item.batteryInvalidDate,
      "YYYY-MM-DD"
    );
    handleModal.form.electrodeInvalidDate = dateFilter(
      item.electrodeInvalidDate,
      "YYYY-MM-DD"
    );
    handleModal.form.exceptionReason = item.exceptionReason;
    handleModal.form.exceptionCode = item.exceptionCode;
    handleModal.show = true;
  },
});
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(
  handleModal.form,
  "handleImagesPath"
);
//日期POP弹出框
const datePop = reactive({
  show: false,
  key: "batteryInvalidDate",
  value: new Date(Date.now()),
  methods: {
    confirm({ selectedValue, selectedOptions }) {
      console.log(selectedValue);
      datePop.value = selectedOptions.map((val: any) => val.text).join("");
      handleModal.form[datePop.key] = selectedOptions
        .map((val: any) => val.text)
        .join("-");
      datePop.show = false;
    },
  },
});
//日期
const handleChangeDate = (key: string) => {
  datePop.key = key;
  datePop.show = true;
};
const refreshing = ref(false);
const nomore = ref(false);
useDidShow(async () => {
  await fetchData();
});
const fetchData = async () => {
  refreshing.value = false;
  nomore.value = false;
  state.page = 1;
  let { content, totalCount, totalPage } = await loadData();
  console.log("列表数据", content);
  state.content = content;
  state.totalCount = totalCount;
  state.totalPage = totalPage;
  if (state.page === state.totalPage) {
    nomore.value = true;
  }
};

async function loadData() {
  let res = await fetchDeviceExceptionRecords({
    page: state.page,
    size: 10,
    type: tabList.value[tabIndex.value].key,
  });
  return Promise.resolve(res);
}

const _onPullDownRefresh = () => {
  setTimeout(() => {
    refreshing.value = false;
  }, 2000);
};
const _onLoadmore = () => {
  setTimeout(async () => {
    if (state.page === state.totalPage) {
      nomore.value = true;
    } else {
      state.page++;
      let { content } = await loadData();
      state.content = [...state.content, ...content];
    }
  }, 1000);
};
const _onScroll = (e) => {
  console.log(e);
};
</script>

<style lang="scss">
.form {
  .nut-dialog__content {
    margin: 0;
  }
}

.manage_item {
  width: 730px;
  margin: 20px auto;
  padding: 15px 15px 35px 25px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20px;
}

.tab_wrap {
  display: flex;
  margin: 0 14px;

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    padding: 0 20px;

    &.active {
      .ft {
        font-weight: bold;
        color: #409eff;
      }
    }

    .ft {
      font-size: 32px;
      color: #333333;
    }
  }
}
</style>
