import React from 'react';
import { TagIcon } from '@heroicons/react/24/solid';
import { QUERY } from '@/constants';
import type {
  Item as RaribleItem,
  Order as RaribleOrder,
  Ownership as RaribleOwnership,
} from '@rarible/api-client';
import type { GetAccountResult } from '@wagmi/core';
import type { Address } from 'viem';

export type TenderType = "eth" | "usdc";
export type OfferType = "bid" | "sell";
export type CollectionBase = typeof QUERY.COLLECTION_BASE[number];
export type CollectionBaseish = CollectionBase | "";

export type UrbitLayer = "locked" | "layer-2" | "layer-1";
export type UrbitPointType = typeof QUERY.POINT_TYPE[number];
export type UrbitPointTypeish = UrbitPointType | "";

export type GetWagmiAccountResult = Omit<GetAccountResult, "address"> & {
  address: Address;
};

export interface NavigationQuery {
  base?: CollectionBase;
  type?: UrbitPointType;
  name?: string;
}

export interface IconLabel<IdType extends string = string> {
  id: IdType;
  name: string;
  icon: typeof TagIcon;
}

export interface KYCData {
  kyc: boolean;
  details?: string;
}

export type TransferData = TransferDenial | TransferGrant;
export interface TransferDenial {
  status: "failed";
  details: string;
}
export interface TransferGrant {
  status: "success";
  callId: string;
  signature: string;
  nonce: string;
  expiryBlock: string;
}

export interface UrbitTraders {
  [wallet: string]: string;  // wallet -> @p
}

export interface UrbitAssoc {
  address: Address;
  signature: string;
}

export interface RaribleContinuation {
  continuation?: string;
}

export interface RouteRaribleItem {
  item: RaribleItem | undefined;
  owner: Address | undefined;
  bids: RaribleOrder[] | undefined;
}

export interface RouteRaribleAccountItem extends RouteRaribleItem, GetWagmiAccountResult {
  offer: RaribleOrder | undefined;
  myItems: RaribleItem[] | undefined;
  isMyItem: boolean;
  isAddressItem: boolean;
}
