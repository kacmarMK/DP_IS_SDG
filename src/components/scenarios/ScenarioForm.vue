<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <div class="row justify-center items-center" style="display: flex; flex-direction: column">
        <q-card class="q-pa-lg col" style="min-width: 500px">
          <div class="column full-width">
            <q-input
              v-model="scenarioStore.scenarioFrame.name"
              filled
              :readonly="isReadonly"
              :label="t('global.name')"
              lazy-rules
              :rules="[(val: string | any[]) => (val && val.length > 0) || t('global.rules.required')]"
            />

            <div>
              <q-select
                v-model="devicesFromOptions"
                filled
                multiple
                :readonly="isReadonly"
                :options="deviceOptions"
                :label="t('device.label', 2)"
                class="q-mb-lg"
              />
            </div>
            <div></div>
            <q-select
              v-model="scenarioStore.scenarioFrame.activeAtHour"
              :options="hourOptions"
              multiple
              use-chips
              behavior="menu"
              outlined
              label="Scenario Activation Hours"
              option-value="value"
              option-label="label"
              style="max-width: 500px"
              class="custom-select"
              @remove="removeHour"
            ></q-select>
            <q-btn label="Select All Hours" size="12px" @click="selectAllHours"></q-btn>
            <div class="row justify-center">
              <q-card class="q-pa-lg q-mt-lg">
                <label style="font-weight: bold">Scenario Activation Days</label>
                <q-option-group
                  v-model="scenarioStore.scenarioFrame.activeAtDay"
                  :options="dayOptions"
                  type="checkbox"
                />
                <q-btn label="Select All Days" class="q-mt-md" @click="selectAllDays"></q-btn>
              </q-card>
              <div class="self-end q-ml-lg">
                <!-- This button will only show when 'showConditions' is false -->
                <q-btn
                  v-if="!showConditions && showAddConditionsButton"
                  label="Add conditions"
                  padding="xl"
                  color="green"
                  size="14px"
                  :icon="mdiPlusCircleOutline"
                  :icon-right="mdiCallSplit"
                  class="q-mt-md"
                  @click="showConditions = true"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div v-if="showConditions" class="q-mt-lg">
        <q-card class="full-width">
          <div class="text-weight-medium q-pa-lg row justify-center" style="font-weight: 600; font-size: 30px">
            {{ t('scenario.conditions') }}
          </div>

          <div class="row justify-center q-mx-xl" style="min-height: 300px; overflow-y: auto">
            <q-card class="full-width" style="z-index: 1">
              <div class="row justify-center">
                <q-btn-toggle
                  v-model="selectedOption"
                  push
                  glossy
                  spread
                  toggle-color="secondary"
                  :options="translatedOptions"
                  style="width: 500px"
                  @click="handleToggleClick"
                />
              </div>
              <div
                v-if="!showProgrammerMode"
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
                <span class="q-pa-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >if</span
                >
                <!--Condition #1-->
                <div
                  class="row q-mx-md q-pa-md justify-center"
                  style="
                    border-radius: 8px;
                    border: 1px solid #858585;
                    background: linear-gradient(to right, whitesmoke, dimgray);
                  "
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
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot1" name="conditionSlot1" val="val" label="Value" />
                      </div>
                      <q-input
                        v-if="conditionSlot1 == 'const'"
                        v-model="inputValue1"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot1 == 'val'"
                        v-model="selectVariable1"
                        :options="conditonVariable1"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand1"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col">
                      <div class="col">
                        <q-radio
                          v-model="conditionSlot2"
                          name="conditionSlot2"
                          val="const"
                          left-label
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot2" name="conditionSlot2" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot2 == 'const'"
                        v-model="inputValue2"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot2 == 'val'"
                        v-model="selectVariable2"
                        :options="conditonVariable2"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                    <div v-if="!firstSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                      <q-btn
                        size="14px"
                        label="+"
                        round
                        dense
                        color="secondary"
                        @click="firstSecondCondition = true"
                      ></q-btn>
                    </div>
                  </div>
                  <div v-if="firstSecondCondition" class="row justify-center items-center q-mt-sm">
                    <q-select
                      v-model="selectOperator1"
                      :options="logicalOperators"
                      label="Logical Operator"
                      dense
                      :rules="[requiredSelectRule]"
                      style="min-width: 200px"
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
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot3" name="conditionSlot3" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot3 == 'const'"
                        v-model="inputValue3"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot3 == 'val'"
                        v-model="selectVariable3"
                        :options="conditonVariable3"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand2"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col">
                      <div class="col">
                        <q-radio
                          v-model="conditionSlot4"
                          name="conditionSlot4"
                          val="const"
                          left-label
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot4" name="conditionSlot4" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot4 == 'const'"
                        v-model="inputValue4"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot4 == 'val'"
                        v-model="selectVariable4"
                        :options="conditonVariable4"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                    <div v-if="firstSecondCondition">
                      <q-btn size="12px" label="X" color="red" @click="firstSecondCondition = false"></q-btn>
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
                    label="Logical Operator"
                    dense
                    :rules="[requiredSelectRule]"
                    class="col-2"
                  ></q-select>
                </div>
                <!--Condition #2-->
                <div
                  v-if="secondCondition"
                  class="row q-mx-md q-pa-md justify-center"
                  style="
                    border-radius: 8px;
                    border: 1px solid #858585;
                    background-color: silver;
                    box-shadow: inset 0 0 10px #999;
                  "
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
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot5" name="conditionSlot5" val="val" label="Value" />
                      </div>
                      <q-input
                        v-if="conditionSlot5 == 'const'"
                        v-model="inputValue5"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot5 == 'val'"
                        v-model="selectVariable5"
                        :options="conditonVariable5"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand3"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col">
                      <div class="col">
                        <q-radio
                          v-model="conditionSlot6"
                          name="conditionSlot6"
                          val="const"
                          left-label
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot6" name="conditionSlot6" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot6 == 'const'"
                        v-model="inputValue6"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot6 == 'val'"
                        v-model="selectVariable6"
                        :options="conditonVariable6"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                    <div v-if="!secondSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                      <q-btn
                        size="14px"
                        label="+"
                        round
                        dense
                        color="secondary"
                        @click="secondSecondCondition = true"
                      ></q-btn>
                    </div>
                  </div>
                  <div v-if="secondSecondCondition" class="row justify-center items-center q-mt-sm">
                    <q-select
                      v-model="selectOperator22"
                      :options="logicalOperators"
                      label="Logical Operator"
                      dense
                      :rules="[requiredSelectRule]"
                      style="min-width: 200px"
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
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot7" name="conditionSlot7" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot7 == 'const'"
                        v-model="inputValue7"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot7 == 'val'"
                        v-model="selectVariable7"
                        :options="conditonVariable7"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand4"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col">
                      <div class="col">
                        <q-radio
                          v-model="conditionSlot8"
                          name="conditionSlot8"
                          val="const"
                          left-label
                          label="Constant"
                          color="secondary"
                        />
                        <q-radio v-model="conditionSlot8" name="conditionSlot8" val="val" label="Value" />
                      </div>

                      <q-input
                        v-if="conditionSlot8 == 'const'"
                        v-model="inputValue8"
                        label="Enter Constant"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="conditionSlot8 == 'val'"
                        v-model="selectVariable8"
                        :options="conditonVariable8"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                    <div v-if="secondSecondCondition">
                      <q-btn size="12px" label="X" color="red" @click="secondSecondCondition = false"></q-btn>
                    </div>
                  </div>
                  <div v-if="secondCondition" class="row justify-end q-pt-md">
                    <q-btn size="12px" label="X" color="red" @click="secondCondition = false"></q-btn>
                  </div>
                </div>

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
                    class="col-2"
                  ></q-select>
                </div>
                <!--Condition #3-->
                <div
                  v-if="thirdCondition"
                  class="row q-mx-md q-pa-md justify-center"
                  style="
                    border-radius: 8px;
                    border: 1px solid #858585;
                    background: radial-gradient(circle, #ccc 30%, #303030 70%);
                  "
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
                      ></q-input>
                      <q-select
                        v-if="conditionSlot9 == 'val'"
                        v-model="selectVariable9"
                        :options="conditonVariable9"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand5"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
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
                      ></q-input>
                      <q-select
                        v-if="conditionSlot10 == 'val'"
                        v-model="selectVariable10"
                        :options="conditonVariable10"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                    <div v-if="!thirdSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                      <q-btn
                        size="14px"
                        label="+"
                        round
                        dense
                        color="secondary"
                        @click="thirdSecondCondition = true"
                      ></q-btn>
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
                    ></q-select>
                  </div>
                  <!--Condition #32-->
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
                      ></q-input>
                      <q-select
                        v-if="conditionSlot11 == 'val'"
                        v-model="selectVariable11"
                        :options="conditonVariable11"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-2 q-mt-lg q-pa-md">
                      <q-select
                        v-model="selectOperand6"
                        :options="operands"
                        label="Operand"
                        dense
                        :rules="[requiredSelectRule]"
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
                      ></q-input>
                      <q-select
                        v-if="conditionSlot12 == 'val'"
                        v-model="selectVariable12"
                        :options="conditonVariable12"
                        label="Choose Value"
                        dense
                        :rules="[requiredSelectRule]"
                      ></q-select>
                    </div>
                    <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                    <div v-if="thirdSecondCondition">
                      <q-btn size="12px" label="X" color="red" @click="thirdSecondCondition = false"></q-btn>
                    </div>
                  </div>
                  <div v-if="thirdCondition" class="row justify-end q-pt-md">
                    <q-btn size="12px" label="X" color="red" @click="thirdCondition = false"></q-btn>
                  </div>
                </div>
                <span
                  class="q-pa-sm q-ma-sm"
                  style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >then</span
                >
                {
                <br />
                <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
                  <div class="row justify-center">
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="noAction"
                      label="No Action"
                      color="red"
                    />
                    <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="notification"
                      label="Notification"
                      color="orange"
                    />
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="condition"
                      label="Condition"
                      color="blue"
                    />
                  </div>
                  <div class="row justify-center">
                    <div class="col">
                      <q-input
                        v-if="thenSlot == 'notification'"
                        v-model="notificationThen"
                        label="Enter Notification Message"
                        dense
                      ></q-input>
                      <q-select
                        v-if="thenSlot === 'job'"
                        v-model="jobThen"
                        :options="jobOptions"
                        label="Jobs"
                        dense
                        class="col"
                      ></q-select>
                      <div
                        v-if="!showProgrammerMode && thenSlot === 'condition'"
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
                        <span
                          class="q-pa-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >if</span
                        >
                        <!--Condition #1-->
                        <div
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background: linear-gradient(to right, whitesmoke, dimgray);
                          "
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot1" name="conditionSlot1" val="val" label="Value" />
                              </div>
                              <q-input
                                v-if="conditionSlot1 == 'const'"
                                v-model="inputValue1"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot1 == 'val'"
                                v-model="selectVariable1"
                                :options="conditonVariable1"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand1"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot2"
                                  name="conditionSlot2"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot2" name="conditionSlot2" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot2 == 'const'"
                                v-model="inputValue2"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot2 == 'val'"
                                v-model="selectVariable2"
                                :options="conditonVariable2"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!firstSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="firstSecondCondition = true"
                              ></q-btn>
                            </div>
                          </div>
                          <div v-if="firstSecondCondition" class="row justify-center items-center q-mt-sm">
                            <q-select
                              v-model="selectOperator1"
                              :options="logicalOperators"
                              label="Logical Operator"
                              dense
                              :rules="[requiredSelectRule]"
                              style="min-width: 200px"
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot3" name="conditionSlot3" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot3 == 'const'"
                                v-model="inputValue3"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot3 == 'val'"
                                v-model="selectVariable3"
                                :options="conditonVariable3"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand2"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot4"
                                  name="conditionSlot4"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot4" name="conditionSlot4" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot4 == 'const'"
                                v-model="inputValue4"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot4 == 'val'"
                                v-model="selectVariable4"
                                :options="conditonVariable4"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="firstSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="firstSecondCondition = false"></q-btn>
                            </div>
                          </div>
                        </div>
                        <div v-if="!secondCondition" class="row q-pa-md">
                          <q-btn
                            size="17px"
                            label="+"
                            round
                            dense
                            color="secondary"
                            @click="secondCondition = true"
                          ></q-btn>
                        </div>
                        <div v-if="secondCondition" class="row justify-center q-mt-sm">
                          <q-select
                            v-model="selectOperator11"
                            :options="logicalOperators"
                            label="Logical Operator"
                            dense
                            :rules="[requiredSelectRule]"
                            class="col-2"
                          ></q-select>
                        </div>
                        <!--Condition #2-->
                        <div
                          v-if="secondCondition"
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background-color: silver;
                            box-shadow: inset 0 0 10px #999;
                          "
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot5" name="conditionSlot5" val="val" label="Value" />
                              </div>
                              <q-input
                                v-if="conditionSlot5 == 'const'"
                                v-model="inputValue5"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot5 == 'val'"
                                v-model="selectVariable5"
                                :options="conditonVariable5"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand3"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot6"
                                  name="conditionSlot6"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot6" name="conditionSlot6" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot6 == 'const'"
                                v-model="inputValue6"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot6 == 'val'"
                                v-model="selectVariable6"
                                :options="conditonVariable6"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!secondSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="secondSecondCondition = true"
                              ></q-btn>
                            </div>
                          </div>
                          <div v-if="secondSecondCondition" class="row justify-center items-center q-mt-sm">
                            <q-select
                              v-model="selectOperator22"
                              :options="logicalOperators"
                              label="Logical Operator"
                              dense
                              :rules="[requiredSelectRule]"
                              style="min-width: 200px"
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot7" name="conditionSlot7" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot7 == 'const'"
                                v-model="inputValue7"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot7 == 'val'"
                                v-model="selectVariable7"
                                :options="conditonVariable7"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand4"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot8"
                                  name="conditionSlot8"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot8" name="conditionSlot8" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot8 == 'const'"
                                v-model="inputValue8"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot8 == 'val'"
                                v-model="selectVariable8"
                                :options="conditonVariable8"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="secondSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="secondSecondCondition = false"></q-btn>
                            </div>
                          </div>
                          <div v-if="secondCondition" class="row justify-end q-pt-md">
                            <q-btn size="12px" label="X" color="red" @click="secondCondition = false"></q-btn>
                          </div>
                        </div>

                        <div v-if="!thirdCondition && secondCondition" class="row q-pa-md">
                          <q-btn
                            size="17px"
                            label="+"
                            round
                            dense
                            color="secondary"
                            @click="thirdCondition = true"
                          ></q-btn>
                        </div>
                        <div v-if="thirdCondition" class="row justify-center q-mt-sm">
                          <q-select
                            v-model="selectOperator2"
                            :options="logicalOperators"
                            label="Logical Operator"
                            dense
                            :rules="[requiredSelectRule]"
                            class="col-2"
                          ></q-select>
                        </div>
                        <!--Condition #3-->
                        <div
                          v-if="thirdCondition"
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background: radial-gradient(circle, #ccc 30%, #303030 70%);
                          "
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot9 == 'val'"
                                v-model="selectVariable9"
                                :options="conditonVariable9"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand5"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot10 == 'val'"
                                v-model="selectVariable10"
                                :options="conditonVariable10"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!thirdSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="thirdSecondCondition = true"
                              ></q-btn>
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
                            ></q-select>
                          </div>
                          <!--Condition #32-->
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot11 == 'val'"
                                v-model="selectVariable11"
                                :options="conditonVariable11"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand6"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot12 == 'val'"
                                v-model="selectVariable12"
                                :options="conditonVariable12"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="thirdSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="thirdSecondCondition = false"></q-btn>
                            </div>
                          </div>
                          <div v-if="thirdCondition" class="row justify-end q-pt-md">
                            <q-btn size="12px" label="X" color="red" @click="thirdCondition = false"></q-btn>
                          </div>
                        </div>
                        <span
                          class="q-pa-sm q-ma-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >then</span
                        >
                        {
                        <br />
                        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
                          <div class="row justify-center">
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="noAction"
                              label="No Action"
                              color="red"
                            />
                            <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="notification"
                              label="Notification"
                              color="orange"
                            />
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="condition"
                              label="Condition"
                              color="blue"
                            />
                          </div>
                          <div class="row justify-center">
                            <div class="col-7">
                              <q-input
                                v-if="thenSlot == 'notification'"
                                v-model="notificationThen"
                                label="Enter Notification Message"
                                dense
                              ></q-input>
                              <q-select
                                v-if="thenSlot === 'job'"
                                v-model="jobThen"
                                :options="jobOptions"
                                label="Jobs"
                                dense
                                class="col"
                              ></q-select>
                            </div>
                          </div>
                        </div>

                        <br />
                        }
                        <span
                          class="q-pa-sm q-mt-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >else</span
                        >
                        {
                        <br />
                        <div class="q-pa-md q-mt-sm" style="border-radius: 8px; border: 1px solid #858585">
                          <div class="row justify-center">
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="noAction"
                              label="No Action"
                              color="red"
                            />
                            <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="notification"
                              label="Notification"
                              color="orange"
                            />
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="condition"
                              label="Condition"
                              color="blue"
                            />
                          </div>
                          <div class="row justify-center">
                            <div class="col-7">
                              <q-input
                                v-if="elseSlot == 'notification'"
                                v-model="notificationElse"
                                label="Enter Notification Message"
                                dense
                              ></q-input>
                              <q-select
                                v-if="elseSlot === 'job'"
                                v-model="jobElse"
                                :options="jobOptions"
                                label="Jobs"
                                dense
                                class="col"
                              ></q-select>
                            </div>
                          </div>
                        </div>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>

                <br />
                }
                <span
                  class="q-pa-sm q-mt-sm"
                  style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >else</span
                >
                {
                <br />
                <div class="q-pa-md q-mt-sm" style="border-radius: 8px; border: 1px solid #858585">
                  <div class="row justify-center">
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="noAction"
                      label="No Action"
                      color="red"
                    />
                    <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="notification"
                      label="Notification"
                      color="orange"
                    />
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="condition"
                      label="Condition"
                      color="blue"
                    />
                  </div>
                  <div class="row justify-center">
                    <div class="col">
                      <q-input
                        v-if="elseSlot == 'notification'"
                        v-model="notificationElse"
                        label="Enter Notification Message"
                        dense
                      ></q-input>
                      <q-select
                        v-if="elseSlot === 'job'"
                        v-model="jobElse"
                        :options="jobOptions"
                        label="Jobs"
                        dense
                        class="col"
                      ></q-select>
                      <div
                        v-if="!showProgrammerMode && elseSlot === 'condition'"
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
                        <span
                          class="q-pa-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >if</span
                        >
                        <!--Condition #1-->
                        <div
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background: linear-gradient(to right, whitesmoke, dimgray);
                          "
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot1" name="conditionSlot1" val="val" label="Value" />
                              </div>
                              <q-input
                                v-if="conditionSlot1 == 'const'"
                                v-model="inputValue1"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot1 == 'val'"
                                v-model="selectVariable1"
                                :options="conditonVariable1"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand1"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot2"
                                  name="conditionSlot2"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot2" name="conditionSlot2" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot2 == 'const'"
                                v-model="inputValue2"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot2 == 'val'"
                                v-model="selectVariable2"
                                :options="conditonVariable2"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!firstSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="firstSecondCondition = true"
                              ></q-btn>
                            </div>
                          </div>
                          <div v-if="firstSecondCondition" class="row justify-center items-center q-mt-sm">
                            <q-select
                              v-model="selectOperator1"
                              :options="logicalOperators"
                              label="Logical Operator"
                              dense
                              :rules="[requiredSelectRule]"
                              style="min-width: 200px"
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot3" name="conditionSlot3" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot3 == 'const'"
                                v-model="inputValue3"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot3 == 'val'"
                                v-model="selectVariable3"
                                :options="conditonVariable3"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand2"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot4"
                                  name="conditionSlot4"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot4" name="conditionSlot4" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot4 == 'const'"
                                v-model="inputValue4"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot4 == 'val'"
                                v-model="selectVariable4"
                                :options="conditonVariable4"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="firstSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="firstSecondCondition = false"></q-btn>
                            </div>
                          </div>
                        </div>
                        <div v-if="!secondCondition" class="row q-pa-md">
                          <q-btn
                            size="17px"
                            label="+"
                            round
                            dense
                            color="secondary"
                            @click="secondCondition = true"
                          ></q-btn>
                        </div>
                        <div v-if="secondCondition" class="row justify-center q-mt-sm">
                          <q-select
                            v-model="selectOperator11"
                            :options="logicalOperators"
                            label="Logical Operator"
                            dense
                            :rules="[requiredSelectRule]"
                            class="col-2"
                          ></q-select>
                        </div>
                        <!--Condition #2-->
                        <div
                          v-if="secondCondition"
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background-color: silver;
                            box-shadow: inset 0 0 10px #999;
                          "
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot5" name="conditionSlot5" val="val" label="Value" />
                              </div>
                              <q-input
                                v-if="conditionSlot5 == 'const'"
                                v-model="inputValue5"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot5 == 'val'"
                                v-model="selectVariable5"
                                :options="conditonVariable5"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand3"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot6"
                                  name="conditionSlot6"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot6" name="conditionSlot6" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot6 == 'const'"
                                v-model="inputValue6"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot6 == 'val'"
                                v-model="selectVariable6"
                                :options="conditonVariable6"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!secondSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="secondSecondCondition = true"
                              ></q-btn>
                            </div>
                          </div>
                          <div v-if="secondSecondCondition" class="row justify-center items-center q-mt-sm">
                            <q-select
                              v-model="selectOperator22"
                              :options="logicalOperators"
                              label="Logical Operator"
                              dense
                              :rules="[requiredSelectRule]"
                              style="min-width: 200px"
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
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot7" name="conditionSlot7" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot7 == 'const'"
                                v-model="inputValue7"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot7 == 'val'"
                                v-model="selectVariable7"
                                :options="conditonVariable7"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand4"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col">
                              <div class="col">
                                <q-radio
                                  v-model="conditionSlot8"
                                  name="conditionSlot8"
                                  val="const"
                                  left-label
                                  label="Constant"
                                  color="secondary"
                                />
                                <q-radio v-model="conditionSlot8" name="conditionSlot8" val="val" label="Value" />
                              </div>

                              <q-input
                                v-if="conditionSlot8 == 'const'"
                                v-model="inputValue8"
                                label="Enter Constant"
                                dense
                                :rules="[requiredInputRule]"
                              ></q-input>
                              <q-select
                                v-if="conditionSlot8 == 'val'"
                                v-model="selectVariable8"
                                :options="conditonVariable8"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="secondSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="secondSecondCondition = false"></q-btn>
                            </div>
                          </div>
                          <div v-if="secondCondition" class="row justify-end q-pt-md">
                            <q-btn size="12px" label="X" color="red" @click="secondCondition = false"></q-btn>
                          </div>
                        </div>

                        <div v-if="!thirdCondition && secondCondition" class="row q-pa-md">
                          <q-btn
                            size="17px"
                            label="+"
                            round
                            dense
                            color="secondary"
                            @click="thirdCondition = true"
                          ></q-btn>
                        </div>
                        <div v-if="thirdCondition" class="row justify-center q-mt-sm">
                          <q-select
                            v-model="selectOperator2"
                            :options="logicalOperators"
                            label="Logical Operator"
                            dense
                            :rules="[requiredSelectRule]"
                            class="col-2"
                          ></q-select>
                        </div>
                        <!--Condition #3-->
                        <div
                          v-if="thirdCondition"
                          class="row q-mx-md q-pa-md justify-center"
                          style="
                            border-radius: 8px;
                            border: 1px solid #858585;
                            background: radial-gradient(circle, #ccc 30%, #303030 70%);
                          "
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot9 == 'val'"
                                v-model="selectVariable9"
                                :options="conditonVariable9"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand5"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot10 == 'val'"
                                v-model="selectVariable10"
                                :options="conditonVariable10"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                            <div v-if="!thirdSecondCondition" class="col-1 q-pa-md q-pt-lg q-mt-lg">
                              <q-btn
                                size="14px"
                                label="+"
                                round
                                dense
                                color="secondary"
                                @click="thirdSecondCondition = true"
                              ></q-btn>
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
                            ></q-select>
                          </div>
                          <!--Condition #32-->
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot11 == 'val'"
                                v-model="selectVariable11"
                                :options="conditonVariable11"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-2 q-mt-lg q-pa-md">
                              <q-select
                                v-model="selectOperand6"
                                :options="operands"
                                label="Operand"
                                dense
                                :rules="[requiredSelectRule]"
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
                              ></q-input>
                              <q-select
                                v-if="conditionSlot12 == 'val'"
                                v-model="selectVariable12"
                                :options="conditonVariable12"
                                label="Choose Value"
                                dense
                                :rules="[requiredSelectRule]"
                              ></q-select>
                            </div>
                            <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>

                            <div v-if="thirdSecondCondition">
                              <q-btn size="12px" label="X" color="red" @click="thirdSecondCondition = false"></q-btn>
                            </div>
                          </div>
                          <div v-if="thirdCondition" class="row justify-end q-pt-md">
                            <q-btn size="12px" label="X" color="red" @click="thirdCondition = false"></q-btn>
                          </div>
                        </div>
                        <span
                          class="q-pa-sm q-ma-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >then</span
                        >
                        {
                        <br />
                        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
                          <div class="row justify-center">
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="noAction"
                              label="No Action"
                              color="red"
                            />
                            <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="notification"
                              label="Notification"
                              color="orange"
                            />
                            <q-radio
                              v-model="thenSlot"
                              class="q-mr-lg"
                              keep-color
                              val="condition"
                              label="Condition"
                              color="blue"
                            />
                          </div>
                          <div class="row justify-center">
                            <div class="col-7">
                              <q-input
                                v-if="thenSlot == 'notification'"
                                v-model="notificationThen"
                                label="Enter Notification Message"
                                dense
                              ></q-input>
                              <q-select
                                v-if="thenSlot === 'job'"
                                v-model="jobThen"
                                :options="jobOptions"
                                label="Jobs"
                                dense
                                class="col"
                              ></q-select>
                            </div>
                          </div>
                        </div>

                        <br />
                        }
                        <span
                          class="q-pa-sm q-mt-sm"
                          style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                          >else</span
                        >
                        {
                        <br />
                        <div class="q-pa-md q-mt-sm" style="border-radius: 8px; border: 1px solid #858585">
                          <div class="row justify-center">
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="noAction"
                              label="No Action"
                              color="red"
                            />
                            <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="notification"
                              label="Notification"
                              color="orange"
                            />
                            <q-radio
                              v-model="elseSlot"
                              class="q-mr-lg"
                              keep-color
                              val="condition"
                              label="Condition"
                              color="blue"
                            />
                          </div>
                          <div class="row justify-center">
                            <div class="col-7">
                              <q-input
                                v-if="elseSlot == 'notification'"
                                v-model="notificationElse"
                                label="Enter Notification Message"
                                dense
                              ></q-input>
                              <q-select
                                v-if="elseSlot === 'job'"
                                v-model="jobElse"
                                :options="jobOptions"
                                label="Jobs"
                                dense
                                class="col"
                              ></q-select>
                            </div>
                          </div>
                        </div>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
                <br />}
              </div>
              <q-input
                v-if="showProgrammerMode"
                v-model="pseudocode"
                filled
                label="Enter your pseudocode here..."
                type="textarea"
                hint="Don't forget to check correct syntax!"
                rows="10"
                style="font-family: monospace; font-size: 20px"
              />
            </q-card>
          </div>
          <div class="row justify-center q-pb-lg">
            <q-btn
              label="Remove conditions"
              padding="xl"
              color="red"
              size="16px"
              :icon="mdiMinusCircleOutline"
              :icon-right="mdiCallSplit"
              @click="
                clearConditions();
                showConditions = false;
              "
            ></q-btn>
          </div>
        </q-card>
      </div>

      <div class="q-mt-lg row justify-center">
        <q-btn
          v-if="showCreateButton"
          :label="buttonLabel"
          type="submit"
          color="primary"
          size="lg"
          style="min-width: 150px"
        />
        <q-btn
          v-if="showRefreshButton"
          :label="t('global.clean')"
          type="reset"
          color="secondary"
          flat
          style="min-width: 150px"
          size="lg"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, toRefs, PropType, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import CommandService from '@/services/CommandService';
import DeviceService from '@/services/DeviceService';
import { useRoute } from 'vue-router';
import { mdiCallSplit, mdiPlusCircleOutline, mdiMinusCircleOutline } from '@quasar/extras/mdi-v6';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const scenarioStore = useScenarioStore();
const props = defineProps({
  mode: {
    type: String,
    default: 'create',
  },
  scenarioData: {
    type: Object as PropType<Scenario>,
    default: ref<ScenarioFrame>({
      rules: ' ',
      name: '',
      devices: [],
      deactivated: false,
      isAlreadyTriggered: false,
      mutedUntil: 0,
      activeAtDay: [],
      activeAtHour: [],
    }),
  },
});
const isReadonly = computed(() => {
  return props.mode === 'detail';
});

scenarioStore.mode = props.mode;
deviceStore.devices.refresh();

const deviceOptions = getDeviceOptions();

const { scenarioData } = toRefs(props);

// A function to update the scenarioFrame ref with scenarioData
const fillScenarioFrame = (data: Scenario) => {
  scenarioStore.scenarioFrame.rules = data.rules || ' ';
  scenarioStore.scenarioFrame.name = data.name || '';
  scenarioStore.scenarioFrame.devices = data.devices || [];
  scenarioStore.scenarioFrame.deactivated = data.deactivated || false;
  scenarioStore.scenarioFrame.isAlreadyTriggered = data.isAlreadyTriggered || false;
  scenarioStore.scenarioFrame.mutedUntil = data.mutedUntil || 0;
  scenarioStore.scenarioFrame.activeAtDay = data.activeAtDay || [];
  scenarioStore.scenarioFrame.activeAtHour = data.activeAtHour || [];
};
fillScenarioFrame(scenarioData.value);
// Watch for changes to scenarioData and update scenarioFrame accordingly
watch(
  props.scenarioData,
  (newValue) => {
    fillScenarioFrame(newValue);
  },
  { deep: true, immediate: true },
); // deep watch to detect nested changes
// Computed property for the button label
const buttonLabel = computed(() => {
  return scenarioStore.mode === 'edit' ? t('global.edit') : t('global.create');
});

// Function to determine if the create button should be shown
const showCreateButton = computed(() => {
  return scenarioStore.mode === 'create' || scenarioStore.mode === 'edit';
});

// Function to determine if the refresh button should be shown
const showRefreshButton = computed(() => {
  return scenarioStore.mode === 'create';
});

const showAddConditionsButton = computed(() => {
  return scenarioStore.mode === 'create';
});

const validatedMutedUntil = computed({
  get: () => scenarioStore.scenarioFrame.mutedUntil,
  set: (value) => {
    if (typeof value !== 'undefined' && value < 0) {
      // If negative number, set it to 0
      scenarioStore.scenarioFrame.mutedUntil = 0;
    } else {
      // Otherwise, set to the provided value
      scenarioStore.scenarioFrame.mutedUntil = value;
    }
  },
});

// Watch for changes in the input value and validate it
watch(
  () => scenarioStore.scenarioFrame.mutedUntil,
  (newValue) => {
    if (typeof newValue !== 'undefined' && newValue < 0) {
      // If negative number, set it to 0
      scenarioStore.scenarioFrame.mutedUntil = 0;
    }
  },
);

const dayOptions = computed(() => [
  { label: t('scenario.day_options.option1'), value: 1 },
  { label: t('scenario.day_options.option2'), value: 2 },
  { label: t('scenario.day_options.option3'), value: 3 },
  { label: t('scenario.day_options.option4'), value: 4 },
  { label: t('scenario.day_options.option5'), value: 5 },
  { label: t('scenario.day_options.option6'), value: 6 },
  { label: t('scenario.day_options.option7'), value: 7 },
]);

const hourOptions = [
  { label: '0:00', value: 0 },
  { label: '1:00', value: 1 },
  { label: '2:00', value: 2 },
  { label: '3:00', value: 3 },
  { label: '4:00', value: 4 },
  { label: '5:00', value: 5 },
  { label: '6:00', value: 6 },
  { label: '7:00', value: 7 },
  { label: '8:00', value: 8 },
  { label: '9:00', value: 9 },
  { label: '10:00', value: 10 },
  { label: '11:00', value: 11 },
  { label: '12:00', value: 12 },
  { label: '13:00', value: 13 },
  { label: '14:00', value: 14 },
  { label: '15:00', value: 15 },
  { label: '16:00', value: 16 },
  { label: '17:00', value: 17 },
  { label: '18:00', value: 18 },
  { label: '19:00', value: 19 },
  { label: '20:00', value: 20 },
  { label: '21:00', value: 21 },
  { label: '22:00', value: 22 },
  { label: '23:00', value: 23 },
];
const removeHour = (val: number) => {
  const index = scenarioStore.scenarioFrame.activeAtHour.indexOf(val);
  if (index > -1) {
    scenarioStore.scenarioFrame.activeAtHour.splice(index, 1);
  }
};

// Methods to select all options
const selectAllHours = () => {
  scenarioStore.scenarioFrame.activeAtHour = hourOptions;
};

const selectAllDays = () => {
  scenarioStore.scenarioFrame.activeAtDay = [1, 2, 3, 4, 5, 6, 7];
};

let devicesFromOptions = ref([]);

function getDeviceOptions() {
  return deviceStore.devices.data?.map((device) => ({
    label: device.name,
    value: device,
  }));
}

interface DeviceOption {
  label: string;
  value: Device;
}

function extractIDFromArray(arrayOfObjects: DeviceOption[]): string[] {
  return arrayOfObjects.map((item) => item.value.uid);
}
const editedScenario = ref<Scenario>();
const route = useRoute();
if (scenarioStore.mode == 'edit') getScenario();

async function onSubmit() {
  if (showConditions.value) {
    scenarioStore.scenarioFrame.rules = parseRules();
  }
  if (scenarioStore.mode == 'create') {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    scenarioStore.createScenario();
  } else {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    setEditedScenario();

    if (editedScenario.value) {
      scenarioStore.editScenario(editedScenario.value);
    }
  }
}

function onReset() {
  scenarioStore.scenarioFrame.rules = ' ';
  scenarioStore.scenarioFrame.name = '';
  devicesFromOptions = ref([]);
  scenarioStore.scenarioFrame.deactivated = false;
  scenarioStore.scenarioFrame.isAlreadyTriggered = false;
  scenarioStore.scenarioFrame.mutedUntil = 0;
  scenarioStore.scenarioFrame.activeAtDay = [];
  scenarioStore.scenarioFrame.activeAtHour = [];
}

function clearConditions() {
  selectVariable1.value = null;
  selectOperand1.value = null;
  selectVariable2.value = null;
  jobThen.value = null;
  notificationThen.value = '';
  notificationElse.value = '';
  jobElse.value = null;
  inputValue1.value = '';
  inputValue2.value = '';

  conditionSlot1.value = 'const';
  conditionSlot2.value = 'const';
  thenSlot.value = 'noAction';
  elseSlot.value = 'noAction';
}

function setEditedScenario() {
  if (editedScenario.value) {
    editedScenario.value.rules = scenarioStore.scenarioFrame.rules || ' ';
    editedScenario.value.name = scenarioStore.scenarioFrame.name || '';
    editedScenario.value.devices = scenarioStore.scenarioFrame.devices;
    editedScenario.value.deactivated = scenarioStore.scenarioFrame.deactivated || false;
    editedScenario.value.isAlreadyTriggered = scenarioStore.scenarioFrame.isAlreadyTriggered || false;
    editedScenario.value.mutedUntil = scenarioStore.scenarioFrame.mutedUntil || 0;
    editedScenario.value.activeAtDay = scenarioStore.scenarioFrame.activeAtDay || [];
    editedScenario.value.activeAtHour = scenarioStore.scenarioFrame.activeAtHour || [];
  }
}

function parseRules() {
  const rulesStringStart = '{"if": [';
  let conditionString = '';
  let thenString = '';
  let elseString = '';
  const rulesStringEnd = ']}';

  // Condition string creation
  if (inputValue1.value && inputValue2.value) {
    // Both condition slots are constants
    conditionString =
      '{ "' + selectOperand1.value?.value + '": [ ' + inputValue1.value + ', ' + inputValue2.value + ' ] },';
  } else if (inputValue1.value && selectVariable2.value) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    //TODO
  } else if (selectVariable1.value && inputValue2.value) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    //TODO
  } else {
    // Both condition slots are variables
    // TODO
  }

  // Then string creation
  if (thenSlot.value === 'noAction') {
    thenString = ' "noAction",';
  } else if (thenSlot.value === 'job') {
    thenString = ' "job:' + jobThen.value?.value + '",';
  } else {
    thenString = ' "notificationMessage:' + notificationThen.value + '",';
  }

  // Else string creation
  if (elseSlot.value === 'noAction') {
    elseString = ' "noAction" ';
  } else if (elseSlot.value === 'job') {
    elseString = ' "job:' + jobElse.value?.value + '"';
  } else {
    elseString = ' "notificationMessage:' + notificationElse.value + '"';
  }

  return rulesStringStart + conditionString + thenString + elseString + rulesStringEnd;
}

async function getScenario() {
  const scenarioId = route.params.id.toString();
  editedScenario.value = await ScenarioService.getScenarioById(scenarioId);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
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
const showProgrammerMode = ref(false);
const selectedOption = ref('graphical');
const translatedOptions = computed(() => [
  { value: 'graphical', label: t('scenario.rules_type_options.option1') },
  { value: 'pseudocode', label: t('scenario.rules_type_options.option2') },
]);

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
const jobThen = ref<Job | null>(null);
const notificationThen = ref('');
const notificationElse = ref('');
const jobElse = ref<Job | null>(null);

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

async function handleToggleClick() {
  if (selectedOption.value == 'graphical') {
    showProgrammerMode.value = false;
  } else {
    showProgrammerMode.value = true;
  }
}

const requiredInputRule = (val: string | number): string | boolean => {
  const number = parseFloat(val as string);
  return (!isNaN(number) && isFinite(number)) || 'This field is empty or input is incorrect';
};
const requiredSelectRule = (val: string) => !!val || val === '' || 'This field is required';

onMounted(async () => {
  const commands = await CommandService.getCommands('NONE', 'NONE');
  let recipes = [];
  for (let command of commands) {
    if (command.recipe) {
      recipes += command;
    }
  }
  jobOptions.value = recipes.map((recipe) => ({
    label: recipe.name,
    value: recipe.id,
  }));

  const devices = await DeviceService.getDevices();
  for (let device of devices) {
    let deviceWithTags = await DeviceService.getDevice(device.uid);
    const mapDataPoints = (dataPoint) => ({
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
</script>

<style lang="scss" scoped>
.right-checkboxes .q-checkbox {
  justify-content: flex-end;
}

.list-group-item {
  display: flex; /* Display items in a row */
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Space between the item text and the close icon */
  padding: 10px 20px; /* Add some padding inside the items */
  margin: 0; /* Remove any default margin */
  border: 1px solid black; /* Black border around each item */
  border-radius: 5px; /* Rounded corners */
  background-color: #f9f9f9; /* Light background color for the button-like appearance */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
  cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
}

.list-group-item + .list-group-item {
  margin-top: -1px; /* Make items touch each other by overlapping borders */
}

.fa-times.close {
  cursor: pointer; /* Ensure the close icon changes cursor to pointer */
  color: #333; /* Color for the close icon */
  margin-left: 15px; /* Space it a bit from the text */
}

/* Additional hover effect for better user feedback */
.list-group-item:hover {
  background-color: #e9ecef;
}

/* Style for the close icon when hovered to give feedback */
.fa-times.close:hover {
  color: #d9534f; /* Change color on hover */
}
</style>
