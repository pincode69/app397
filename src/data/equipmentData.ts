export type EquipmentType = 'hook' | 'float' | 'bucket' | 'shoes' | 'lifebuoy' | 'lamp' | 'cap';

export type EquipmentItem = {
  id: string;
  type: EquipmentType;
  name: string;
  imageIndex?: number;
  price: number;
};

export const ALL_EQUIPMENT: EquipmentItem[] = [
  // Hooks
  { id: 'hook1', type: 'hook', name: 'Hook 1', imageIndex: 1, price: 0 }, // Free starter
  { id: 'hook2', type: 'hook', name: 'Hook 2', imageIndex: 2, price: 50 },
  { id: 'hook3', type: 'hook', name: 'Hook 3', imageIndex: 3, price: 100 },
  { id: 'hook4', type: 'hook', name: 'Hook 4', imageIndex: 4, price: 150 },
  { id: 'hook5', type: 'hook', name: 'Hook 5', imageIndex: 5, price: 200 },
  { id: 'hook6', type: 'hook', name: 'Hook 6', imageIndex: 6, price: 250 },
  { id: 'hook7', type: 'hook', name: 'Hook 7', imageIndex: 7, price: 300 },
  // Floats
  { id: 'float1', type: 'float', name: 'Float 1', imageIndex: 1, price: 0 }, // Free starter
  { id: 'float2', type: 'float', name: 'Float 2', imageIndex: 2, price: 40 },
  { id: 'float3', type: 'float', name: 'Float 3', imageIndex: 3, price: 80 },
  { id: 'float4', type: 'float', name: 'Float 4', imageIndex: 4, price: 120 },
  { id: 'float5', type: 'float', name: 'Float 5', imageIndex: 5, price: 160 },
  // Other equipment
  { id: 'bucket', type: 'bucket', name: 'Bucket', price: 0 }, // Free starter
  { id: 'shoes', type: 'shoes', name: 'Fishing Shoes', price: 100 },
  { id: 'lifebuoy', type: 'lifebuoy', name: 'Lifebuoy', price: 200 },
  { id: 'lamp', type: 'lamp', name: 'Lamp', price: 150 },
  { id: 'cap', type: 'cap', name: 'Cap', price: 80 },
];

export const getEquipmentImage = (item: EquipmentItem) => {
  if (item.type === 'hook' && item.imageIndex) {
    const hookImages: { [key: number]: any } = {
      1: require('../../assets/images/equipment/hook/1.png'),
      2: require('../../assets/images/equipment/hook/2.png'),
      3: require('../../assets/images/equipment/hook/3.png'),
      4: require('../../assets/images/equipment/hook/4.png'),
      5: require('../../assets/images/equipment/hook/5.png'),
      6: require('../../assets/images/equipment/hook/6.png'),
      7: require('../../assets/images/equipment/hook/7.png'),
    };
    return hookImages[item.imageIndex] || hookImages[1];
  }
  if (item.type === 'float' && item.imageIndex) {
    const floatImages: { [key: number]: any } = {
      1: require('../../assets/images/equipment/float/1.png'),
      2: require('../../assets/images/equipment/float/2.png'),
      3: require('../../assets/images/equipment/float/3.png'),
      4: require('../../assets/images/equipment/float/4.png'),
      5: require('../../assets/images/equipment/float/5.png'),
    };
    return floatImages[item.imageIndex] || floatImages[1];
  }
  if (item.type === 'bucket') {
    return require('../../assets/images/equipment/bucket.png');
  }
  if (item.type === 'shoes') {
    return require('../../assets/images/equipment/shoes.png');
  }
  if (item.type === 'lifebuoy') {
    return require('../../assets/images/equipment/lifebuoy.png');
  }
  if (item.type === 'lamp') {
    return require('../../assets/images/equipment/lamp.png');
  }
  if (item.type === 'cap') {
    return require('../../assets/images/equipment/cap.png');
  }
  return null;
};
