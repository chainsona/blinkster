import { ActionsSpecGetResponse, LinkedAction } from "@dialectlabs/blinks";
import { ActionGetResponse, ActionRuleObject } from "@solana/actions";

/**
 * Represents an extended action with additional properties.
 */
export interface ActionExtended {
  /** unique identifier for the action */
  id: string;
  /** unique identifier for the provider */
  providerId: string;
  /** name of the action */
  name: string;
  /** description of the action */
  description: string;
  /** path pattern for the action */
  pathPattern: string;
  /** api path for the action */
  apiPath: string;
  /** action url for the action */
  actionUrl: string;
  /** action data for the action */
  actionData: ActionsSpecGetResponse;
  /** list of related Actions a user could perform */
  actionParams: LinkedAction[];
  /** date the action was created */
  createdAt: string;
}

/**
 * Extends the ActionRuleObject with additional properties.
 */
export interface ActionRuleObjectExtended extends ActionRuleObject {
  /** unique identifier for the rule (optional) */
  id?: string;
  /** action url for the rule */
  actionUrl: string;
  /** action data for the rule (optional) */
  actionData?: any;
  /** date the rule was created */
  createdAt: string;
}

/**
 * Represents a Blink provider with associated actions and rules.
 */
export interface BlinkProvider {
  /** unique identifier for the provider */
  id: string;
  /** name of the provider */
  name: string;
  /** url for the provider */
  url: string;
  /** domain of the provider */
  domain: string;
  /** icon url for the provider */
  icon: string;
  /** list of related Actions a user could perform */
  blinks?: ActionGetResponse[];
  /** list of related Rules a user could perform */
  rules?: ActionRuleObjectExtended[];
  /** date the provider was created */
  createdAt?: string;
  /** whether the provider is registered */
  registered?: boolean;
}

/**
 * Represents a campaign with its properties.
 */
export type Campaign = {
  /** unique identifier for the campaign */
  id: string;
  /** name of the campaign */
  name: string;
  /** description of the campaign (optional) */
  description: string | null;
  /** URL of the campaign image (optional) */
  imageUrl: string;
  /** status of the campaign */
  status: string;
  /** start date of the campaign */
  startDate: Date;
  /** end date of the campaign */
  endDate: Date;
  /** date the campaign was created */
  createdAt: Date;
  /** date the campaign was last updated */
  updatedAt: Date;
  /** daily data for the campaign */
  dailyData?: {
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }[];
};

/**
 * Represents a registry blink with its properties.
 */
export type RegistryBlink = {
  /** URL for the action */
  actionUrl: string;
  /** URL for the blink (optional) */
  blinkUrl: string | null;
  /** URL for the website */
  websiteUrl: string;
  /** date the registry blink was created */
  createdAt: string;
  /** tags associated with the registry blink (optional) */
  tags?: string[];
};

/**
 * Represents the response from the registry.
 */
export type RegistryResponse = {
  /** array of registry blink results */
  results: RegistryBlink[];
};
