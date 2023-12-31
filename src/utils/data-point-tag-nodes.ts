import { Collection } from '@/models/Collection';
import { DataPointTag } from '@/models/DataPointTag';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { Device } from '@/models/Device';
import { Module } from '@/models/Module';

function deviceToDataPointTagNode(device: Device): DataPointTagNode {
  return {
    uid: device.uid,
    name: device.name,
    children:
      device.dataPointTags?.map((tag) => ({
        uid: tag.uid,
        name: tag.name,
        isActive: false,
        dataPointTag: tag,
        children: [],
      })) ?? [],
  };
}

function moduleToDataPointTagNode(module: Module): DataPointTagNode {
  return {
    uid: module.uid,
    name: module.name,
    children: module.devices?.map(deviceToDataPointTagNode) ?? [],
  };
}

function collectionToDataPointTagNode(coll: Collection): DataPointTagNode {
  return {
    uid: coll.uid,
    name: coll.name,
    children: coll.modules?.map(moduleToDataPointTagNode) ?? [],
  };
}

function nodeToDataPointTags(node: DataPointTagNode): DataPointTag[] {
  const tags: DataPointTag[] = [];

  if (node.dataPointTag) {
    tags.push(node.dataPointTag);
  }

  if (node.children) {
    node.children.forEach((child) => {
      tags.push(...nodeToDataPointTags(child));
    });
  }

  return tags;
}

export {
  collectionToDataPointTagNode,
  moduleToDataPointTagNode,
  deviceToDataPointTagNode,
  nodeToDataPointTags,
};
