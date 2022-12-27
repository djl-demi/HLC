<!--
 * @Description: 
 * @Author: Pengfei
 * @Date: 2022-06-22 16:26:10
 * @LastEditTime: 2022-07-01 10:31:40
 * @LastEditors: Pengfei
-->

<template>
  <div class="dataScreen">
    <a-row style="width: 100%;height: 100%;padding:0;margin:0">
      <a-col :span="4" style="height: 100%;padding:0 5px;margin:0">
        <div style="display: flex;height: 35px;line-height:35px;text-align:center;">
          <div style="flex: 1;">全部{{ onLineCount + offLineCount }}</div>
          <div style="flex: 1;">在线{{ onLineCount }}</div>
          <div style="flex: 1">离线{{ offLineCount }}</div>
        </div>
        <div style="width: 100%;margin:10px 0;">
          <a-radio-group :default-value="type" button-style="solid" style="width: 100%;" @change="typeChange">
            <a-radio-button value="1">
              小区监控
            </a-radio-button>
            <a-radio-button value="2">
              分组监控
            </a-radio-button>
          </a-radio-group>
        </div>
        <div style="width: 100%;display: flex;">
          <a-input-search v-model="typeName" :placeholder="`输入${type == 1 ? '小区' : '分组'}名称`" size="default" style="width:calc(100% - 50px)" @search="searchChange" />
          <a-button v-if="!isPlaying" type="primary" size="default" style="width: 50px;text-align: center;padding:0" :disabled="checkedData.length == 0" @click="playAll">
            播放
          </a-button>
          <a-button v-if="isPlaying" type="primary" size="default" style="width: 50px;text-align: center;padding:0" @click="stopAll">
            暂停
          </a-button>
        </div>
        <div style="width: 100%;overflow-y: auto;height: calc(100% - 120px)">
          <div v-if="treeData.length == 0" style="width:100%;text-align:center;padding: 20px 0;">暂无数据</div>
          <!-- <a-tree
            v-if="treeData.length>0"
            checkable 
            :tree-data="treeData"
            show-icon 
            class="buildingNoList"
            :default-expand-all="true"
            :default-expanded-keys="selectedTree"
            :default-checked-keys="selectedTree"
            :replace-fields="replaceFields"
            @check="onCheck"
          >
            <a-icon slot="switcherIcon" type="down" />
            <template slot="custom" slot-scope="item">
              <div style="display: flex;justify-content: space-between;width: 130px;color:#fff;">
                <div class="node-title">{{ item.name }} </div>
                <div class="icon-wrap">
                  <span style="color:#31C27C;" v-if="item.isOnline>0">在线</span>
                  <span style="color:#fff"  v-if="item.isOnline===0">离线</span>
                </div>
              </div>
            </template>
          </a-tree> -->
          <div v-for="(treeItem, index) in treeData" :key="index" style="padding:5px 0;cursor: pointer;">
            <div>
              <a-icon :type="treeItem.isExpand ? 'down' : 'right'" @click="treeItem.isExpand = !treeItem.isExpand" style="color:#31C27C;padding-right:10px;" />
              <a-checkbox
                :checked="treeItem.videoList.every(item => item.isCheck) || treeItem.isCheck"
                :indeterminate="treeItem.videoList.some(item => item.isCheck) && !treeItem.videoList.every(item => item.isCheck)"
                style="color:#31C27C;padding-right:10px;"
                @change="parentTreeChange(treeItem)"
              ></a-checkbox>
              <span>{{ treeItem.name }}</span>
            </div>
            <div v-if="treeItem.isExpand" style="padding-right:10px">
              <div v-for="(subItem, subIndex) in treeItem.videoList" :key="subIndex" style=";padding-left:50px;margin-top:10px;display:flex;justify-content: space-between;">
                <div>
                  <a-checkbox :checked="subItem.isCheck" :disabled="subItem.isOnline === 0" style="color:#31C27C;padding-right:10px;" @change="childTreeChange(subItem)"></a-checkbox>
                  <span>{{ subItem.name || "--" }}</span>
                </div>
                <div>
                  <span style="color:#31C27C;" v-if="subItem.isOnline > 0">在线</span>
                  <span style="color:#fff" v-if="subItem.isOnline === 0">离线</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="20" style="height: 100%;padding:0;margin:0">
        <div style="height: 100%;display: flex;flex-direction: row;flex-wrap: wrap;border-radius: 3px;">
          <div v-for="node in checkedTree" :key="node.id" style="border: 1px solid #00e4ff;width: calc(100%/3);height: calc(100%/3)">
            <div style="width:100%;height: 40px;line-height:40px;text-align:center;border-bottom: 1px solid #00e4ff;">{{ node.name }}</div>
            <div style="width: 100%;height: calc(100% - 40px);text-align:center;">
              <!-- <a-icon theme="filled" type="play-circle" style="font-size: 35px;margin-top: 100px;cursor: pointer;" @click="playVideo(node)" v-if="!node.httpUrl"/> -->
              <video
                :ref="'video' + node.id"
                :id="'video' + node.id"
                controls
                autoplay
                :poster="require('@/assets/bg/playercover.jpg')"
                class="video-item"
                v-if="node.httpUrl"
                @click="playVideo(node)"
              ></video>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import flvjs from "flv.js"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "",
  data() {
    return {
      treeData: [],
      selectedTree: [],
      type: "1",
      typeName: "",
      checkedTree: [
        { name: "暂无视频", id: 1 },
        { name: "暂无视频", id: 2 },
        { name: "暂无视频", id: 3 },
        { name: "暂无视频", id: 4 },
        { name: "暂无视频", id: 5 },
        { name: "暂无视频", id: 6 },
        { name: "暂无视频", id: 7 },
        { name: "暂无视频", id: 8 },
        { name: "暂无视频", id: 9 }
      ],
      checkedData: [],
      onLineCount: 0,
      offLineCount: 0,
      replaceFields: {
        children: "videoList",
        title: "name",
        key: "id"
      },
      isPlaying: false
    }
  },
  created() {
    this.getVideoStatusCount()
    this.getGroupVideos("")
  },
  methods: {
    disabledTree() {
      let checkedIds = this.checkedTree.map(cid => cid.id)
      console.log(checkedIds)
      this.treeData.forEach(treeItem => {
        treeItem.videoList.forEach(item => {
          if (!checkedIds.includes(item.id)) {
            item.isDisabled = true
          }
        })
      })
    },
    undisabledTree() {
      let checkedIds = this.checkedTree.map(cid => cid.id)
      this.treeData.forEach(treeItem => {
        treeItem.videoList.forEach(item => {
          if (!checkedIds.includes(item.id) && item.isOnline > 0) {
            item.isDisabled = false
          }
        })
      })
    },
    parentTreeChange(item) {
      if (item.isCheck) {
        this.checkedData = this.checkedData.filter(v => item.videoList.every(val => val.id != v.id))
      } else {
        this.checkedData = [...this.checkedData, ...item.videoList.filter(cid => cid.isOnline > 0)]
      }
      item.isCheck = !item.isCheck
      item.videoList.forEach(data => {
        data.isCheck = item.isCheck
      })

      if (this.checkedData.length > 9) {
        this.$message.info({ content: "最多只能选择9条视频" })
        this.checkedData = this.checkedData.splice(0, 9)
      }

      this.isChecked()
    },
    childTreeChange(item) {
      let index = this.checkedData.findIndex(icd => icd.id === item.id)
      if (this.checkedData.length >= 9 && !item.isCheck) {
        this.$message.info({ content: "最多只能选择9条视频" })
        return
      }

      if (!item.isCheck) {
        item.isCheck = true
        this.checkedData.push(item)
      } else {
        item.isCheck = false
        this.checkedData.splice(index, 1)
      }
      this.isChecked()

      // this.findAllCheckedTree();
    },

    isChecked() {
      this.checkedTree = [
        { name: "暂无视频", id: 1 },
        { name: "暂无视频", id: 2 },
        { name: "暂无视频", id: 3 },
        { name: "暂无视频", id: 4 },
        { name: "暂无视频", id: 5 },
        { name: "暂无视频", id: 6 },
        { name: "暂无视频", id: 7 },
        { name: "暂无视频", id: 8 },
        { name: "暂无视频", id: 9 }
      ]
      this.treeData.forEach(tree => {
        let ids = this.checkedData.map(icd => icd.id)
        tree.videoList.forEach(item => {
          item.isCheck = ids.includes(item.id)
        })
        let length = tree.videoList.length
        let cLength = tree.videoList.filter(cid => cid.isCheck).length
        if (cLength === 0) {
          tree.isCheck = false
        }
        if (length === cLength) {
          tree.isCheck = true
        }
      })

      for (let i = 0; i < this.checkedData.length; i++) {
        this.checkedTree[i] = this.checkedData[i]
      }
    },
    typeChange(e) {
      let type = e.target.value
      this.type = type
      this.checkedData = []
      this.checkedTree = []
      this.typeName = ""
      this.checkedTree = [
        { name: "暂无视频", id: 1 },
        { name: "暂无视频", id: 2 },
        { name: "暂无视频", id: 3 },
        { name: "暂无视频", id: 4 },
        { name: "暂无视频", id: 5 },
        { name: "暂无视频", id: 6 },
        { name: "暂无视频", id: 7 },
        { name: "暂无视频", id: 8 },
        { name: "暂无视频", id: 9 }
      ]
      this.getGroupVideos(this.typeName)
    },
    filterTree(tree) {
      return tree.map(item => {
        item.scopedSlots = { title: "custom" }
        item.videoList = item.videoList.map(i => {
          i.scopedSlots = { title: "custom" }
          i.disableCheckbox = i.isOnline > 0 ? false : true
          i.checked = true
          return i
        })
        return item
      })
    },
    getVideoStatusCount() {
      this.$api.videoStatusCount({}).then(({ data: { onlineCount, offlineCount } }) => {
        this.onLineCount = onlineCount
        this.offLineCount = offlineCount
      })
    },
    getGroupVideos(typeName) {
      this.checkedTree = [
        { name: "暂无视频", id: 1 },
        { name: "暂无视频", id: 2 },
        { name: "暂无视频", id: 3 },
        { name: "暂无视频", id: 4 },
        { name: "暂无视频", id: 5 },
        { name: "暂无视频", id: 6 },
        { name: "暂无视频", id: 7 },
        { name: "暂无视频", id: 8 },
        { name: "暂无视频", id: 9 }
      ]
      this.checkedData = []
      this.isPlaying = false
      const data = {
        type: this.type,
        typeName
      }
      this.$api.getVideoListByGroup(data).then(({ data }) => {
        // this.treeData = this.filterTree(data);
        this.treeData = data.map(item => {
          item.isExpand = true
          item.isCheck = false
          item.videoList.map(i => {
            i.isCheck = false
            i.isDisabled = false
            return i
          })
          return item
        })
      })
    },

    searchChange() {
      this.getGroupVideos(this.typeName)
    },

    playVideo(item) {
      this.isPlaying = true
      if (flvjs.isSupported() && item.httpUrl) {
        let videoElement = document.getElementById("video" + item.id)
        this["flvPlayer" + item.id] = flvjs.createPlayer(
          {
            type: "flv",
            hasAudio: false,
            url: item.httpUrl
          },
          {
            enableWorker: false, //不启用分离线程
            enableStashBuffer: false, //关闭IO隐藏缓冲区
            reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true //自动清除缓存
          }
        )
        this["flvPlayer" + item.id].attachMediaElement(videoElement)
        this["flvPlayer" + item.id].load()
        this["flvPlayer" + item.id].play()
      } else {
        this.$message.info("暂无播放信息")
      }
    },

    playAll() {
      this.checkedTree.forEach(item => {
        item.httpUrl && this.playVideo(item)
      })
    },
    stopAll() {
      this.checkedData.forEach(item => {
        item.httpUrl && this.stopV(item)
      })
    },
    stopV(item) {
      this.isPlaying = false
      if (this["flvPlayer" + item.id]) {
        this["flvPlayer" + item.id].pause()
        this["flvPlayer" + item.id].unload()
        this["flvPlayer" + item.id].detachMediaElement()
        this["flvPlayer" + item.id].destroy()
        this["flvPlayer" + item.id] = ""
      }
    }
  }
}
</script>

<style scoped lang="less">
.dataScreen {
  /* height: 100%; */
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  background-image: url(../../../assets/data/index/background.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  min-width: 1290px;
  color: #fff;

  .video-item {
    width: 100%;
    height: 100%;
  }
}
.buildingNoList {
  width: 100%;
  color: #fff;
  .ant-tree-child-tree {
    width: 200px;
    li {
      width: 100%;
    }
  }
}
#root .ant-radio-group {
  width: 100% !important;
}
.ant-radio-button-wrapper {
  width: 50% !important;
  text-align: center;
}
</style>
