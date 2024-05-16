<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div
    v-if="!showProgrammerMode && !showPseudocode"
    style="
      background-color: #f5f5f5;
      padding: 70px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre;
      overflow-x: auto;
      border: 1px solid #ddd;
      font-size: 17px;
    "
  >
    <span class="q-pa-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block">if</span>
    <!--Condition #1-->
    <div
      class="row q-mx-md q-pa-md justify-center"
      style="border-radius: 8px; border: 1px solid #858585; background: linear-gradient(to right, whitesmoke, dimgray)"
    >
      <div
        class="row q-mx-md q-pa-lg"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mt-md q-pt-sm" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot1"
              name="conditionSlot1"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
              @update:model-value="selectVariable1 = null"
            />
            <q-radio
              v-model="conditionSlot1"
              name="conditionSlot1"
              val="val"
              label="Hodnota"
              @update:model-value="inputValue1 = ''"
            />
          </div>
          <q-input
            v-if="conditionSlot1 == 'const'"
            v-model="inputValue1"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot1 == 'val'"
            v-model="selectVariable1"
            :options="conditonVariable1"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand1"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot2"
              name="conditionSlot2"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
              @update:model-value="selectVariable2 = null"
            />
            <q-radio
              v-model="conditionSlot2"
              name="conditionSlot2"
              val="val"
              label="Hodnota"
              @update:model-value="inputValue2 = ''"
            />
          </div>

          <q-input
            v-if="conditionSlot2 == 'const'"
            v-model="inputValue2"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot2 == 'val'"
            v-model="selectVariable2"
            :options="conditonVariable2"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
        <div v-if="!firstSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
          <q-btn size="14px" label="+" round dense color="secondary" @click="firstSecondCondition = true"></q-btn>
        </div>
      </div>
      <div v-if="firstSecondCondition" class="row justify-center items-center q-mt-sm">
        <q-select
          v-model="selectOperator1"
          :options="logicalOperators"
          label="Logický operátor"
          dense
          :rules="[requiredSelectRule]"
          style="min-width: 200px"
          @update:model-value="parseRules"
        ></q-select>
      </div>
      <!--Condition #12-->
      <div
        v-if="firstSecondCondition"
        class="row q-mx-md q-pa-md"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mx-md q-pt-lg" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot3"
              name="conditionSlot3"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
              @update:model-value="selectVariable3 = null"
            />
            <q-radio
              v-model="conditionSlot3"
              name="conditionSlot3"
              val="val"
              label="Hodnota"
              @update:model-value="inputValue3 = ''"
            />
          </div>

          <q-input
            v-if="conditionSlot3 == 'const'"
            v-model="inputValue3"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot3 == 'val'"
            v-model="selectVariable3"
            :options="conditonVariable3"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand2"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot4"
              name="conditionSlot4"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
              @update:model-value="selectVariable4 = null"
            />
            <q-radio
              v-model="conditionSlot4"
              name="conditionSlot4"
              val="val"
              label="Hodnota"
              @update:model-value="inputValue4 = ''"
            />
          </div>

          <q-input
            v-if="conditionSlot4 == 'const'"
            v-model="inputValue4"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot4 == 'val'"
            v-model="selectVariable4"
            :options="conditonVariable4"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

        <div v-if="firstSecondCondition">
          <q-btn
            size="12px"
            label="X"
            color="red"
            @click="
              firstSecondCondition = false;
              selectOperator1 = '';
              selectVariable3 = null;
              inputValue3 = '';
              selectVariable4 = null;
              inputValue4 = '';
              selectOperand2 = null;
            "
          ></q-btn>
        </div>
      </div>
    </div>
    <div v-if="!secondCondition" class="row q-pa-md">
      <q-btn size="17px" label="+" round dense color="secondary" @click="secondCondition = true"></q-btn>
    </div>
    <div v-if="secondCondition" class="row justify-center q-mt-sm">
      <q-select
        v-model="selectOperator11"
        :options="logicalOperators"
        label="Logický operátor"
        dense
        :rules="[requiredSelectRule]"
        class="col-2"
        style="min-width: 200px"
        @update:model-value="parseRules"
      ></q-select>
    </div>
    <!--Condition #2-->
    <div
      v-if="secondCondition"
      class="row q-mx-md q-pa-md justify-center"
      style="border-radius: 8px; border: 1px solid #858585; background-color: silver; box-shadow: inset 0 0 10px #999"
    >
      <div
        class="row q-mx-md q-pa-lg"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mt-md q-pt-sm" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot5"
              name="conditionSlot5"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
            />
            <q-radio v-model="conditionSlot5" name="conditionSlot5" val="val" label="Hodnota" />
          </div>
          <q-input
            v-if="conditionSlot5 == 'const'"
            v-model="inputValue5"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot5 == 'val'"
            v-model="selectVariable5"
            :options="conditonVariable5"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand3"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot6"
              name="conditionSlot6"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
            />
            <q-radio v-model="conditionSlot6" name="conditionSlot6" val="val" label="Hodnota" />
          </div>

          <q-input
            v-if="conditionSlot6 == 'const'"
            v-model="inputValue6"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot6 == 'val'"
            v-model="selectVariable6"
            :options="conditonVariable6"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
        <div v-if="!secondSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
          <q-btn size="14px" label="+" round dense color="secondary" @click="secondSecondCondition = true"></q-btn>
        </div>
      </div>
      <div v-if="secondSecondCondition" class="row justify-center items-center q-mt-sm">
        <q-select
          v-model="selectOperator22"
          :options="logicalOperators"
          label="Logický operátor"
          dense
          :rules="[requiredSelectRule]"
          style="min-width: 200px"
          @update:model-value="parseRules"
        ></q-select>
      </div>
      <!--Condition #22-->
      <div
        v-if="secondSecondCondition"
        class="row q-mx-md q-pa-md"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mx-md q-pt-lg" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot7"
              name="conditionSlot7"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
            />
            <q-radio v-model="conditionSlot7" name="conditionSlot7" val="val" label="Hodnota" />
          </div>

          <q-input
            v-if="conditionSlot7 == 'const'"
            v-model="inputValue7"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot7 == 'val'"
            v-model="selectVariable7"
            :options="conditonVariable7"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand4"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot8"
              name="conditionSlot8"
              val="const"
              left-label
              label="Konštanta"
              color="secondary"
            />
            <q-radio v-model="conditionSlot8" name="conditionSlot8" val="val" label="Hodnota" />
          </div>

          <q-input
            v-if="conditionSlot8 == 'const'"
            v-model="inputValue8"
            label="Vlož konštantu"
            dense
            :rules="[requiredInputRule]"
          ></q-input>
          <q-select
            v-if="conditionSlot8 == 'val'"
            v-model="selectVariable8"
            :options="conditonVariable8"
            label="Vyber hodnotu"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

        <div v-if="secondSecondCondition">
          <q-btn
            size="12px"
            label="X"
            color="red"
            @click="
              secondSecondCondition = false;
              selectOperator22 = '';
              selectVariable7 = null;
              inputValue7 = '';
              selectVariable8 = null;
              inputValue8 = '';
              selectOperand4 = null;
            "
          ></q-btn>
        </div>
      </div>
      <div v-if="secondCondition" class="row justify-end q-pt-md">
        <q-btn
          size="12px"
          label="X"
          color="red"
          @click="
            secondCondition = false;
            selectOperator11 = '';
            selectVariable5 = null;
            inputValue5 = '';
            selectVariable6 = null;
            inputValue6 = '';
            selectOperand3 = null;
          "
        ></q-btn>
      </div>
    </div>
    <!--
    <div v-if="!thirdCondition && secondCondition" class="row q-pa-md">
      <q-btn size="17px" label="+" round dense color="secondary" @click="thirdCondition = true"></q-btn>
    </div>
    <div v-if="thirdCondition" class="row justify-center q-mt-sm">
      <q-select
        v-model="selectOperator2"
        :options="logicalOperators"
        label="Logical Operator"
        dense
        :rules="[requiredSelectRule]"
        style="min-width: 200px"
        class="col-2"
        @update:model-value="parseRules"
      ></q-select>
    </div>-->
    <!--Condition #3-->
    <!--
    <div
      v-if="thirdCondition"
      class="row q-mx-md q-pa-md justify-center"
      style="border-radius: 8px; border: 1px solid #858585; background: radial-gradient(circle, #ccc 30%, #303030 70%)"
    >
      <div
        class="row q-mx-md q-pa-lg"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mt-md q-pt-sm" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot9"
              name="conditionSlot9"
              val="const"
              left-label
              label="Constant"
              color="secondary"
            />
            <q-radio v-model="conditionSlot9" name="conditionSlot9" val="val" label="Value" />
          </div>
          <q-input
            v-if="conditionSlot9 == 'const'"
            v-model="inputValue9"
            label="Enter Constant"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot9 == 'val'"
            v-model="selectVariable9"
            :options="conditonVariable9"
            label="Choose Value"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand5"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot10"
              name="conditionSlot10"
              val="const"
              left-label
              label="Constant"
              color="secondary"
            />
            <q-radio v-model="conditionSlot10" name="conditionSlot10" val="val" label="Value" />
          </div>

          <q-input
            v-if="conditionSlot10 == 'const'"
            v-model="inputValue10"
            label="Enter Constant"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot10 == 'val'"
            v-model="selectVariable10"
            :options="conditonVariable10"
            label="Choose Value"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
        <div v-if="!thirdSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
          <q-btn size="14px" label="+" round dense color="secondary" @click="thirdSecondCondition = true"></q-btn>
        </div>
      </div>
      <div v-if="thirdSecondCondition" class="row justify-center items-center q-mt-sm">
        <q-select
          v-model="selectOperator33"
          :options="logicalOperators"
          label="Logical Operator"
          dense
          :rules="[requiredSelectRule]"
          style="min-width: 200px"
          @update:model-value="parseRules"
        ></q-select>
      </div>-->
    <!--Condition #32-->
    <!--
      <div
        v-if="thirdSecondCondition"
        class="row q-mx-md q-pa-md"
        style="border-radius: 8px; border: 1px solid #858585; width: 100%; background-color: white"
      >
        <div class="col-1 q-mx-md q-pt-lg" style="font-size: 40px">(</div>
        <div class="col-4">
          <div class="col">
            <q-radio
              v-model="conditionSlot11"
              name="conditionSlot11"
              val="const"
              left-label
              label="Constant"
              color="secondary"
            />
            <q-radio v-model="conditionSlot11" name="conditionSlot11" val="val" label="Value" />
          </div>

          <q-input
            v-if="conditionSlot11 == 'const'"
            v-model="inputValue11"
            label="Enter Constant"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot11 == 'val'"
            v-model="selectVariable11"
            :options="conditonVariable11"
            label="Choose Value"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-2 q-mt-lg q-pa-md">
          <q-select
            v-model="selectOperand6"
            :options="operands"
            label="Operand"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col">
          <div class="col">
            <q-radio
              v-model="conditionSlot12"
              name="conditionSlot12"
              val="const"
              left-label
              label="Constant"
              color="secondary"
            />
            <q-radio v-model="conditionSlot12" name="conditionSlot12" val="val" label="Value" />
          </div>

          <q-input
            v-if="conditionSlot12 == 'const'"
            v-model="inputValue12"
            label="Enter Constant"
            dense
            :rules="[requiredInputRule]"
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="conditionSlot12 == 'val'"
            v-model="selectVariable12"
            :options="conditonVariable12"
            label="Choose Value"
            dense
            :rules="[requiredSelectRule]"
            @update:model-value="parseRules"
          ></q-select>
        </div>
        <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

        <div v-if="thirdSecondCondition">
          <q-btn
            size="12px"
            label="X"
            color="red"
            @click="
              thirdSecondCondition = false;
              selectOperator33 = '';
              selectVariable11 = null;
              inputValue11 = '';
              selectVariable12 = null;
              inputValue12 = '';
              selectOperand6 = null;
            "
          ></q-btn>
        </div>
      </div>
      <div v-if="thirdCondition" class="row justify-end q-pt-md">
        <q-btn
          size="12px"
          label="X"
          color="red"
          @click="
            thirdCondition = false;
            selectOperator2 = '';
            selectVariable9 = null;
            inputValue9 = '';
            selectVariable10 = null;
            inputValue10 = '';
            selectOperand5 = null;
          "
        ></q-btn>
      </div>
    </div>-->
    <span class="q-pa-sm q-ma-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
      >then</span
    >
    {
    <br />
    <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
      <div class="row justify-center">
        <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="noAction" label="Žiadna akcia" color="red" />
        <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="job" label="Job (Riadiaca úloha)" color="teal" />
        <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="notification" label="Notifikácia" color="orange" />
        <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="condition" label="Podmienka" color="blue" />
      </div>
      <div class="row justify-center">
        <div class="col">
          <q-input
            v-if="thenSlot === 'notification'"
            v-model="notificationThen"
            label="Vlož správu notifikácie"
            dense
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="thenSlot === 'job'"
            v-model="jobThen"
            :options="jobOptions"
            label="Job (Riadiaca úloha)"
            dense
            class="col"
            @update:model-value="parseRules"
          ></q-select>
          <condition-builder
            v-if="thenSlot === 'condition'"
            :show-programmer-mode="showProgrammerMode"
            :show-pseudocode="showPseudocode"
            @update-json-value="(value) => handleUpdateJsonValue(value, 'thenCondition')"
            @update-pseudocode-value="(value) => handleUpdatePseudocodeValue(value, 'thenCondition')"
          ></condition-builder>
        </div>
      </div>
      <div v-if="thenSlot === 'job' || thenSlot === 'notification'" class="q-pa-sm q-mt-lg">
        <div class="row justify-center">
          <q-btn color="white" text-color="black" label="TRVANIE" style="width: 145px; height: 54px" size="16px" />
          <q-select
            v-model="durationOptionThen"
            filled
            :options="durationOptions"
            style="width: 145px"
            @update:model-value="parseRules"
          />

          <q-input
            v-if="durationOptionThen === 'SET'"
            v-model="durationTimeThen"
            filled
            mask="fulltime"
            :rules="['fulltime']"
            style="width: 160px"
            @update:model-value="parseRules"
          >
            <template #append>
              <q-btn :icon="mdiClockTimeFourOutline">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="durationTimeThen" with-seconds format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zavrieť" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <br />
    }
    <span class="q-pa-sm q-mt-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
      >else</span
    >
    {
    <br />
    <div class="q-pa-md q-mt-sm" style="border-radius: 8px; border: 1px solid #858585">
      <div class="row justify-center">
        <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="noAction" label="Žiadna akcia" color="red" />
        <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="job" label="Job (Riadiaca úloha)" color="teal" />
        <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="notification" label="Notifikácia" color="orange" />
        <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="condition" label="Podmienka" color="blue" />
      </div>
      <div class="row justify-center">
        <div class="col">
          <q-input
            v-if="elseSlot === 'notification'"
            v-model="notificationElse"
            label="Vlož správu notifikácie"
            dense
            @update:model-value="parseRules"
          ></q-input>
          <q-select
            v-if="elseSlot === 'job'"
            v-model="jobElse"
            :options="jobOptions"
            label="Job (Riadiaca úloha)"
            dense
            class="col"
            @update:model-value="parseRules"
          ></q-select>
          <condition-builder
            v-if="elseSlot === 'condition'"
            :show-programmer-mode="showProgrammerMode"
            :show-pseudocode="showPseudocode"
            @update-json-value="(value) => handleUpdateJsonValue(value, 'elseCondition')"
            @update-pseudocode-value="(value) => handleUpdatePseudocodeValue(value, 'elseCondition')"
          ></condition-builder>
          <div v-if="elseSlot === 'job' || elseSlot === 'notification'" class="q-pa-sm q-mt-lg">
            <div class="row justify-center">
              <q-btn color="white" text-color="black" label="TRVANIE" style="width: 145px; height: 54px" size="16px" />
              <q-select
                v-model="durationOptionElse"
                filled
                :options="durationOptions"
                style="width: 145px"
                @update:model-value="parseRules"
              />

              <q-input
                v-if="durationOptionElse === 'SET'"
                v-model="durationTimeElse"
                filled
                mask="fulltime"
                :rules="['fulltime']"
                style="width: 160px"
                @update:model-value="parseRules"
              >
                <template #append>
                  <q-btn :icon="mdiClockTimeFourOutline">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="durationTimeElse" with-seconds format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zavrieť" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, toRefs, PropType, onMounted, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import CommandService from '@/services/CommandService';
import DeviceService from '@/services/DeviceService';
import { useRoute } from 'vue-router';
import { mdiClockTimeFourOutline } from '@quasar/extras/mdi-v6';
import ConditionBuilder from '@/components/scenarios/ConditionBuilder.vue';
import { Command } from '@/models/Command';

const scenarioStore = useScenarioStore();
defineProps({
  showProgrammerMode: Boolean,
  showPseudocode: Boolean,
});

//const emit = defineEmits(['onDeleted']);

const { t } = useI18n();

interface Operand {
  label: string;
  value: string;
}
interface Job {
  label: string;
  value: string;
}
interface Variable {
  label: string;
  value: string;
}

const showConditions = ref(false);
const inputValue1 = ref('');
const inputValue2 = ref('');
const inputValue3 = ref('');
const inputValue4 = ref('');
const inputValue5 = ref('');
const inputValue6 = ref('');
const inputValue7 = ref('');
const inputValue8 = ref('');
const inputValue9 = ref('');
const inputValue10 = ref('');
const inputValue11 = ref('');
const inputValue12 = ref('');
const selectVariable1 = ref<Variable | null>(null);
const selectOperand1 = ref<Operand | null>(null);
const selectOperand2 = ref<Operand | null>(null);
const selectOperand3 = ref<Operand | null>(null);
const selectOperand4 = ref<Operand | null>(null);
const selectOperand5 = ref<Operand | null>(null);
const selectOperand6 = ref<Operand | null>(null);
const selectVariable2 = ref<Variable | null>(null);
const selectVariable3 = ref<Variable | null>(null);
const selectVariable4 = ref<Variable | null>(null);
const selectVariable5 = ref<Variable | null>(null);
const selectVariable6 = ref<Variable | null>(null);
const selectVariable7 = ref<Variable | null>(null);
const selectVariable8 = ref<Variable | null>(null);
const selectVariable9 = ref<Variable | null>(null);
const selectVariable10 = ref<Variable | null>(null);
const selectVariable11 = ref<Variable | null>(null);
const selectVariable12 = ref<Variable | null>(null);
const operands = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
];
const conditonVariable1 = ref<{ label: string; value: string }[]>([]);
const conditonVariable2 = ref<{ label: string; value: string }[]>([]);
const conditonVariable3 = ref<{ label: string; value: string }[]>([]);
const conditonVariable4 = ref<{ label: string; value: string }[]>([]);
const conditonVariable5 = ref<{ label: string; value: string }[]>([]);
const conditonVariable6 = ref<{ label: string; value: string }[]>([]);
const conditonVariable7 = ref<{ label: string; value: string }[]>([]);
const conditonVariable8 = ref<{ label: string; value: string }[]>([]);
const conditonVariable9 = ref<{ label: string; value: string }[]>([]);
const conditonVariable10 = ref<{ label: string; value: string }[]>([]);
const conditonVariable11 = ref<{ label: string; value: string }[]>([]);
const conditonVariable12 = ref<{ label: string; value: string }[]>([]);
const jobOptions = ref<{ label: string; value: string }[]>([]);
const jobThen = ref<Job | null>(null);
const notificationThen = ref('');
const notificationElse = ref('');
const jobElse = ref<Job | null>(null);
const conditionSlot1 = ref('const');
const conditionSlot2 = ref('const');
const conditionSlot3 = ref('const');
const conditionSlot4 = ref('const');
const conditionSlot5 = ref('const');
const conditionSlot6 = ref('const');
const conditionSlot7 = ref('const');
const conditionSlot8 = ref('const');
const conditionSlot9 = ref('const');
const conditionSlot10 = ref('const');
const conditionSlot11 = ref('const');
const conditionSlot12 = ref('const');
const thenSlot = ref('noAction');
const elseSlot = ref('noAction');

const durationOptionThen = ref('SET');
const durationOptionElse = ref('SET');
const durationOptions = ['SET', 'RESET'];
const durationTimeThen = ref('00:00:00');
const durationTimeElse = ref('00:00:00');
const firstSecondCondition = ref(false);
const secondCondition = ref(false);
const secondSecondCondition = ref(false);
const thirdCondition = ref(false);
const thirdSecondCondition = ref(false);

const selectOperator1 = ref('');
const selectOperator2 = ref('');
const selectOperator11 = ref('');
const selectOperator22 = ref('');
const selectOperator33 = ref('');
const logicalOperators = [
  { label: 'and', value: '&&' },
  { label: 'or', value: '||' },
];

onMounted(async () => {
  const commands = await CommandService.getCommands('NONE', 'NONE');

  let recipes = ref<Command[]>([]);
  for (let command of commands) {
    if (command.recipe) {
      recipes.value.push(command);
    }
  }
  jobOptions.value = recipes.value.map((recipe: Command) => ({
    label: recipe.name,
    value: recipe.id,
  }));

  const devices = await DeviceService.getDevices();
  for (let device of devices) {
    let deviceWithTags = await DeviceService.getDevice(device.uid);
    const mapDataPoints = (dataPoint: { name: string; tag: string }) => ({
      label: device.name + ' - ' + dataPoint.name,
      value: device.uid + '.' + dataPoint.tag,
    });
    conditonVariable1.value = [...conditonVariable1.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable2.value = [...conditonVariable2.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable3.value = [...conditonVariable3.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable4.value = [...conditonVariable4.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable5.value = [...conditonVariable5.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable6.value = [...conditonVariable6.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable7.value = [...conditonVariable7.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable8.value = [...conditonVariable8.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable9.value = [...conditonVariable9.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable10.value = [...conditonVariable10.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable11.value = [...conditonVariable11.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
    conditonVariable12.value = [...conditonVariable12.value, ...deviceWithTags.dataPointTags.map(mapDataPoints)];
  }
});
const requiredInputRule = (val: string | number): string | boolean => {
  const number = parseFloat(val as string);
  return (!isNaN(number) && isFinite(number)) || 'Pole je prázdne alebo vstup je nesprávny';
};
const requiredSelectRule = (val: string) => !!val || val === '' || 'Toto pole je povinné';

function conditionStringBuilder(
  inputValue1: string,
  inputValue2: string,
  selectVariable1: string | undefined,
  selectVariable2: string | undefined,
  operand: string | undefined,
) {
  var conditionString = '';
  if (inputValue1 && inputValue2) {
    // Both condition slots are constants
    conditionString = '{ "' + operand + '": [ ' + inputValue1 + ', ' + inputValue2 + ' ]}';
  } else if (inputValue1 && selectVariable2) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    conditionString = '{ "' + operand + '": [ ' + inputValue1 + ', {"var": "' + selectVariable2 + '"} ]}';
  } else if (selectVariable1 && inputValue2) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    conditionString = '{ "' + operand + '": [{"var": "' + selectVariable1 + '"}, ' + inputValue2 + ' ]}';
  } else if (selectVariable1 && selectVariable2) {
    // Both condition slots are variables
    conditionString =
      '{ "' + operand + '": [{"var": "' + selectVariable1 + '"}, ' + ' {"var": "' + selectVariable2 + '"} ]}';
  }
  return conditionString;
}

function pseudoConditionStringBuilder(
  inputValue1: string,
  inputValue2: string,
  selectVariable1: string | undefined,
  selectVariable2: string | undefined,
  operand: string | undefined,
) {
  var conditionString = '';
  if (inputValue1 && inputValue2) {
    // Both condition slots are constants
    conditionString = inputValue1 + ' ' + operand + ' ' + inputValue2;
  } else if (inputValue1 && selectVariable2) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    conditionString = inputValue1 + ' ' + operand + ' ' + selectVariable2;
  } else if (selectVariable1 && inputValue2) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    conditionString = selectVariable1 + ' ' + operand + ' ' + inputValue2;
  } else if (selectVariable1 && selectVariable2) {
    // Both condition slots are variables
    conditionString = selectVariable1 + ' ' + operand + ' ' + selectVariable2;
  }
  return conditionString;
}
const rulesStringStart = '{"if": [';
let conditionString = '';
let thenString = '';
let elseString = '';
const rulesStringEnd = ']}';
function parseRules() {
  const rulesStringStart = '{"if": [';
  let conditionString = '';
  //let thenString = '';
  //let elseString = '';
  const rulesStringEnd = ']}';
  parseRulesPseudocode();
  if (
    (inputValue1.value === '' && selectVariable1.value == null) ||
    (inputValue2.value === '' && selectVariable2.value == null) ||
    selectOperand1.value == null
  ) {
    return;
  }
  if (firstSecondCondition.value) {
    if (
      (inputValue3.value === '' && selectVariable3.value == null) ||
      (inputValue4.value === '' && selectVariable4.value == null) ||
      selectOperand2.value == null ||
      selectOperator1.value == ''
    ) {
      return;
    }
  }

  if (secondCondition.value) {
    if (
      (inputValue5.value === '' && selectVariable5.value == null) ||
      (inputValue6.value === '' && selectVariable6.value == null) ||
      selectOperand3.value == null ||
      selectOperator11.value == ''
    ) {
      return;
    }
  }

  if (secondSecondCondition.value) {
    if (
      (inputValue7.value === '' && selectVariable7.value == null) ||
      (inputValue8.value === '' && selectVariable8.value == null) ||
      selectOperand4.value == null ||
      selectOperator22.value == ''
    ) {
      return;
    }
  }
  /*
  if (thirdCondition.value) {
    if (
      (inputValue9.value === '' && selectVariable9.value == null) ||
      (inputValue10.value === '' && selectVariable10.value == null) ||
      selectOperand5.value == null ||
      selectOperator2.value == ''
    ) {
      return;
    }
  }

  if (thirdSecondCondition.value) {
    if (
      (inputValue11.value === '' && selectVariable11.value == null) ||
      (inputValue12.value === '' && selectVariable12.value == null) ||
      selectOperand6.value == null ||
      selectOperator33.value == ''
    ) {
      return;
    }
  }*/
  //////////////////////////////////////////////////////////////////////////////////

  const firstConditionString = conditionStringBuilder(
    inputValue1.value,
    inputValue2.value,
    selectVariable1.value?.value,
    selectVariable2.value?.value,
    selectOperand1.value.value,
  );
  var firstSecondConditionString;
  var secondConditionString;
  var secondSecondConditionString;

  if (firstSecondCondition.value) {
    firstSecondConditionString = conditionStringBuilder(
      inputValue3.value,
      inputValue4.value,
      selectVariable3.value?.value,
      selectVariable4.value?.value,
      selectOperand2.value?.value,
    );
  }
  if (secondCondition.value) {
    secondConditionString = conditionStringBuilder(
      inputValue5.value,
      inputValue6.value,
      selectVariable5.value?.value,
      selectVariable6.value?.value,
      selectOperand3.value?.value,
    );
  }
  if (secondSecondCondition.value) {
    secondSecondConditionString = conditionStringBuilder(
      inputValue7.value,
      inputValue8.value,
      selectVariable7.value?.value,
      selectVariable8.value?.value,
      selectOperand4.value?.value,
    );
  }

  // first and second main conditions are selected
  if (secondCondition.value) {
    conditionString = '{ "' + selectOperator11.value.label + '": [';
    if (firstSecondCondition.value) {
      // first condition containing two conditions
      conditionString +=
        '{ "' +
        selectOperator1.value.label +
        '": [' +
        firstConditionString +
        ', ' +
        firstSecondConditionString +
        ' ]}, ';
    } else {
      conditionString += firstConditionString + ', ';
    }
    if (secondSecondCondition.value) {
      // second condition containing two conditions
      conditionString +=
        '{ "' +
        selectOperator22.value.label +
        '": [' +
        secondConditionString +
        ', ' +
        secondSecondConditionString +
        ' ]}, ';
    } else {
      // second condition containing one condition
      conditionString += secondConditionString + ' ';
    }
    conditionString += ', ';
  } else if (firstSecondCondition.value) {
    // main condition containing two conditions
    conditionString +=
      '{ "' + selectOperator1.value.label + '": [' + firstConditionString + ', ' + firstSecondConditionString + ' ]}, ';
  } else {
    conditionString = firstConditionString + ', ';
  }
  /*
  // Condition string creation
  if (inputValue1.value && inputValue2.value) {
    // Both condition slots are constants
    conditionString =
      '{ "' + selectOperand1.value?.value + '": [ ' + inputValue1.value + ', ' + inputValue2.value + ' ]},';
  } else if (inputValue1.value && selectVariable2.value) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ ' +
      inputValue1.value +
      ', {"var": "' +
      selectVariable2.value.value +
      '"} ]},';
  } else if (selectVariable1.value && inputValue2.value) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ {"var": "' +
      selectVariable1.value.value +
      '"}, ' +
      inputValue2.value +
      ' ]},';
  } else if (selectVariable1.value && selectVariable2.value) {
    // Both condition slots are variables
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ {"var": "' +
      selectVariable1.value.value +
      '"}, ' +
      ' {"var": "' +
      selectVariable2.value.value +
      '"} ]},';
  }*/

  // Then string creation
  if (thenSlot.value === 'noAction') {
    thenString = ' "noAction",';
  } else if (thenSlot.value === 'job') {
    if (durationOptionThen.value === 'SET') {
      if (durationTimeThen.value === '00:00:00') {
        thenString = ' "job:' + jobThen.value?.value + '",';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        thenString = ' "' + forTimeString + 'job:' + jobThen.value?.value + '",';
      }
    } else {
      // RESET
      thenString = ' "forTime:reset:job:' + jobThen.value?.value + '",';
    }
  } else if (thenSlot.value === 'notification') {
    if (durationOptionThen.value === 'SET') {
      if (durationTimeThen.value === '00:00:00') {
        thenString = ' "notificationMessage:' + notificationThen.value + '",';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        thenString = ' "' + forTimeString + 'notificationMessage:' + notificationThen.value + '",';
      }
    } else {
      // RESET
      thenString = ' "forTime:reset:notificationMessage:' + notificationThen.value + '",';
    }
  } else {
    // THEN CONDITION
    thenString += ',';
  }

  // Else string creation
  if (elseSlot.value === 'noAction') {
    elseString = ' "noAction" ';
  } else if (elseSlot.value === 'job') {
    if (durationOptionElse.value === 'SET') {
      if (durationTimeElse.value === '00:00:00') {
        elseString = ' "job:' + jobElse.value?.value + '"';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        elseString = ' "' + forTimeString + 'job:' + jobElse.value?.value + '"';
      }
    } else {
      // RESET
      elseString = ' "forTime:reset:job:' + jobElse.value?.value + '"';
    }
  } else if (elseSlot.value === 'notification') {
    if (durationOptionElse.value === 'SET') {
      if (durationTimeElse.value === '00:00:00') {
        elseString = ' "notificationMessage:' + notificationElse.value + '"';
      } else {
        // SET forTime
        let hourMinSec = durationTimeElse.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        elseString = ' "' + forTimeString + 'notificationMessage:' + notificationElse.value + '"';
      }
    } else {
      // RESET
      elseString = ' "forTime:reset:notificationMessage:' + notificationElse.value + '"';
    }
  } else {
    // ELSE CONDITION
  }
  emit('updateJsonValue', rulesStringStart + conditionString + thenString + elseString + rulesStringEnd);
}
const pseudoRulesStringStart = 'if (';
let pseudoConditionString = '';
let pseudoThenString = '';
let pseudoElseString = '';
const pseudoRulesStringEnd = '}';
function parseRulesPseudocode() {
  const pseudoRulesStringStart = 'if (';
  let pseudoConditionString = '';
  //let pseudoThenString = '';
  //let pseudoElseString = '';
  const pseudoRulesStringEnd = '}';
  if (
    (inputValue1.value === '' && selectVariable1.value == null) ||
    (inputValue2.value === '' && selectVariable2.value == null) ||
    selectOperand1.value == null
  ) {
    return;
  }
  if (firstSecondCondition.value) {
    if (
      (inputValue3.value === '' && selectVariable3.value == null) ||
      (inputValue4.value === '' && selectVariable4.value == null) ||
      selectOperand2.value == null ||
      selectOperator1.value == ''
    ) {
      return;
    }
  }

  if (secondCondition.value) {
    if (
      (inputValue5.value === '' && selectVariable5.value == null) ||
      (inputValue6.value === '' && selectVariable6.value == null) ||
      selectOperand3.value == null ||
      selectOperator11.value == ''
    ) {
      return;
    }
  }

  if (secondSecondCondition.value) {
    if (
      (inputValue7.value === '' && selectVariable7.value == null) ||
      (inputValue8.value === '' && selectVariable8.value == null) ||
      selectOperand4.value == null ||
      selectOperator22.value == ''
    ) {
      return;
    }
  }
  /*
  if (thirdCondition.value) {
    if (
      (inputValue9.value === '' && selectVariable9.value == null) ||
      (inputValue10.value === '' && selectVariable10.value == null) ||
      selectOperand5.value == null ||
      selectOperator2.value == ''
    ) {
      return;
    }
  }

  if (thirdSecondCondition.value) {
    if (
      (inputValue11.value === '' && selectVariable11.value == null) ||
      (inputValue12.value === '' && selectVariable12.value == null) ||
      selectOperand6.value == null ||
      selectOperator33.value == ''
    ) {
      return;
    }
  }*/
  //////////////////////////////////////////////////////////////////////////////////

  const firstConditionString = pseudoConditionStringBuilder(
    inputValue1.value,
    inputValue2.value,
    selectVariable1.value?.value,
    selectVariable2.value?.value,
    selectOperand1.value.value,
  );
  var firstSecondConditionString = '';
  var secondConditionString = '';
  var secondSecondConditionString = '';

  if (firstSecondCondition.value) {
    firstSecondConditionString = pseudoConditionStringBuilder(
      inputValue3.value,
      inputValue4.value,
      selectVariable3.value?.value,
      selectVariable4.value?.value,
      selectOperand2.value?.value,
    );
  }
  if (secondCondition.value) {
    secondConditionString = pseudoConditionStringBuilder(
      inputValue5.value,
      inputValue6.value,
      selectVariable5.value?.value,
      selectVariable6.value?.value,
      selectOperand3.value?.value,
    );
  }
  if (secondSecondCondition.value) {
    secondSecondConditionString = pseudoConditionStringBuilder(
      inputValue7.value,
      inputValue8.value,
      selectVariable7.value?.value,
      selectVariable8.value?.value,
      selectOperand4.value?.value,
    );
  }

  // first and second main conditions are selected
  if (secondCondition.value) {
    if (firstSecondCondition.value) {
      // first condition containing two conditions
      pseudoConditionString +=
        '[(' +
        firstConditionString +
        ') ' +
        selectOperator1.value.value +
        ' (' +
        firstSecondConditionString +
        ')] ' +
        selectOperator11.value.value +
        ' ';
    } else {
      pseudoConditionString += '(' + firstConditionString + ') ' + selectOperator11.value.value + ' ';
    }
    if (secondSecondCondition.value) {
      // second condition containing two conditions
      pseudoConditionString +=
        '[(' + secondConditionString + ') ' + selectOperator22.value.value + ' (' + secondSecondConditionString + ')])';
    } else {
      // second condition containing one condition
      pseudoConditionString += '(' + secondConditionString + '))';
    }
  } else if (firstSecondCondition.value) {
    // main condition containing two conditions
    pseudoConditionString +=
      firstConditionString + ' ' + selectOperator1.value.value + ' ' + firstSecondConditionString + ')';
  } else {
    pseudoConditionString = firstConditionString + ')';
  }
  /*
  // Condition string creation
  if (inputValue1.value && inputValue2.value) {
    // Both condition slots are constants
    conditionString =
      '{ "' + selectOperand1.value?.value + '": [ ' + inputValue1.value + ', ' + inputValue2.value + ' ]},';
  } else if (inputValue1.value && selectVariable2.value) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ ' +
      inputValue1.value +
      ', {"var": "' +
      selectVariable2.value.value +
      '"} ]},';
  } else if (selectVariable1.value && inputValue2.value) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ {"var": "' +
      selectVariable1.value.value +
      '"}, ' +
      inputValue2.value +
      ' ]},';
  } else if (selectVariable1.value && selectVariable2.value) {
    // Both condition slots are variables
    conditionString =
      '{ "' +
      selectOperand1.value?.value +
      '": [ {"var": "' +
      selectVariable1.value.value +
      '"}, ' +
      ' {"var": "' +
      selectVariable2.value.value +
      '"} ]},';
  }*/

  // Then string creation

  if (thenSlot.value === 'noAction') {
    pseudoThenString = ' { "noAction"; } ';
  } else if (thenSlot.value === 'job') {
    if (durationOptionThen.value === 'SET') {
      if (durationTimeThen.value === '00:00:00') {
        pseudoThenString = ' { "job:' + jobThen.value?.value + '"; } ';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        pseudoThenString = ' { "' + forTimeString + 'job:' + jobThen.value?.value + '"; } ';
      }
    } else {
      // RESET
      pseudoThenString = ' { "forTime:reset:job:' + jobThen.value?.value + '"; } ';
    }
  } else if (thenSlot.value === 'notification') {
    if (durationOptionThen.value === 'SET') {
      if (durationTimeThen.value === '00:00:00') {
        pseudoThenString = ' { "notificationMessage:' + notificationThen.value + '"; } ';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        pseudoThenString = ' { "' + forTimeString + 'notificationMessage:' + notificationThen.value + '"; } ';
      }
    } else {
      // RESET
      pseudoThenString = ' { "forTime:reset:notificationMessage:' + notificationThen.value + '"; } ';
    }
  } else {
    // THEN CONDITION
    pseudoThenString = ' {' + pseudoThenString + '} ';
  }

  // Else string creation
  if (elseSlot.value === 'noAction') {
    pseudoElseString = ' { "noAction"; ';
  } else if (elseSlot.value === 'job') {
    if (durationOptionElse.value === 'SET') {
      if (durationTimeElse.value === '00:00:00') {
        pseudoElseString = ' { "job:' + jobElse.value?.value + '"; ';
      } else {
        // SET forTime
        let hourMinSec = durationTimeThen.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        pseudoElseString = ' { "' + forTimeString + 'job:' + jobElse.value?.value + '"; ';
      }
    } else {
      // RESET
      pseudoElseString = ' { "forTime:reset:job:' + jobElse.value?.value + '"; ';
    }
  } else if (elseSlot.value === 'notification') {
    if (durationOptionElse.value === 'SET') {
      if (durationTimeElse.value === '00:00:00') {
        pseudoElseString = ' { "notificationMessage:' + notificationElse.value + '"; ';
      } else {
        // SET forTime
        let hourMinSec = durationTimeElse.value.split(':');
        let forTimeString = 'forTime:set:';
        let hours = parseInt(hourMinSec[0], 10);
        let minutes = parseInt(hourMinSec[1], 10);
        let seconds = parseInt(hourMinSec[2], 10);
        if (hours > 0) {
          forTimeString += hours + ':hour:';
        }
        if (minutes > 0) {
          forTimeString += minutes + ':min:';
        }
        if (seconds > 0) {
          forTimeString += seconds + ':sec:';
        }
        pseudoElseString = ' { "' + forTimeString + 'notificationMessage:' + notificationElse.value + '"; ';
      }
    } else {
      // RESET
      pseudoElseString = ' { "forTime:reset:notificationMessage:' + notificationElse.value + '"; ';
    }
  } else {
    // ELSE CONDITION
    pseudoElseString = ' {' + pseudoElseString + '} ';
  }
  emit(
    'updatePseudocodeValue',
    pseudoRulesStringStart +
      pseudoConditionString +
      pseudoThenString +
      'else' +
      pseudoElseString +
      pseudoRulesStringEnd,
  );
}

const emit = defineEmits(['updateJsonValue', 'updatePseudocodeValue']);

const handleUpdateJsonValue = (value: string, identifier: string) => {
  if (identifier === 'elseCondition') {
    elseString = value;
  } else {
    thenString = value;
  }
  parseRules();
};

const handleUpdatePseudocodeValue = (value: string, identifier: string) => {
  if (identifier === 'elseCondition') {
    pseudoElseString = value;
  } else {
    pseudoThenString = value;
  }
  parseRules();
  //cenarioStore.scenarioPseudocode =
  //  pseudoRulesStringStart + pseudoConditionString + pseudoThenString + pseudoElseString + pseudoRulesStringEnd;
};

defineExpose({ parseRules, parseRulesPseudocode });
</script>
<style lang="scss" scoped></style>
