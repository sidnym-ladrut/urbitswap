import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import cn from 'classnames';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useConnect, useDisconnect } from 'wagmi';
import {
  BoltIcon,
  BoltSlashIcon,
  ChevronDownIcon,
  DocumentIcon,
  FunnelIcon,
  GlobeAltIcon,
  HomeIcon,
  IdentificationIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  ViewfinderCircleIcon,
  WalletIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from '@heroicons/react/24/solid';
import ENSName from '@/components/ENSName';
import UrbitswapIcon from '@/components/icons/UrbitswapIcon';
import { DropdownMenu, DropdownEntry } from '@/components/Dropdown';
import { useModalNavigate } from '@/logic/routing';
import { encodeQuery, decodeQuery } from '@/logic/utils';
import {
  useWagmiAccount,
  useUrbitAccountAssocAddresses,
  useVentureAccountKYC,
} from '@/state/app';
import { wagmiAPI } from '@/api';
import { QUERY } from '@/constants';
import type { Chain } from 'viem'; // node_modules/viem/types/chain.ts
import type {
  CollectionBase,
  UrbitPointType,
  UrbitLayer,
  NavigationQuery,
} from '@/types/app';

export default function NavBar({
  className,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
}) {
  const [queryBase, setQueryBase] = useState<CollectionBase | undefined>(undefined);
  const [queryType, setQueryType] = useState<UrbitPointType | undefined>(undefined);
  const [queryName, setQueryName] = useState<string>("");
  const query: NavigationQuery = useMemo(() => ({
    base: queryBase,
    type: queryType,
    name: queryName ? queryName : undefined,
  }), [queryBase, queryType, queryName]);

  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const modalNavigate = useModalNavigate();
  const { address, isConnected } = useWagmiAccount();
  const { connect } = useConnect({connector: wagmiAPI.connectors?.[0]});
  const { disconnect } = useDisconnect();

  const assocAddresses = useUrbitAccountAssocAddresses();
  const isAssociated: boolean = (assocAddresses ?? new Set()).has(address);
  const vccKYC = {}; // useVentureAccountKYC();
  const isKYCd: boolean = false; // vccKYC !== undefined && vccKYC.kyc;

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {value}: {value: string;} = event.target;
    setQueryName(value);
  }, [setQueryName]);
  const onSubmit = useCallback((newQuery: NavigationQuery | void) => {
    const queryParams: URLSearchParams = encodeQuery({
      ...query,
      ...(!newQuery ? {} : newQuery),
    });
    navigate(`/?${queryParams.toString()}`);
  }, [query, navigate]);
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }, [onSubmit]);

  const DropdownButton = useCallback(({
    title,
    children,
    className
  }: {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn(
      "button flex flex-row items-center space-x-2",
      "font-semibold text-sm sm:text-md",
      className,
    )}>
      {children}
      <div className="hidden sm:block">
        {title}
      </div>
      <ChevronDownIcon className="h-3 w-3" />
    </div>
  ), []);

  useEffect(() => {
    const paramsQuery: NavigationQuery = decodeQuery(params);
    const newQuery: NavigationQuery = {...query, ...paramsQuery};
    setQueryBase(newQuery?.base);
    setQueryType(newQuery?.type);
    setQueryName(newQuery?.name ?? "");
  }, [params]);

  return (
    <nav className={cn(
      "w-full py-2 px-4 bg-white border-gray-800 border-b-2",
      className,
    )}>
      <div className={cn(
        "flex flex-row justify-between space-x-1 sm:space-x-2 items-center",
        innerClassName,
      )}>
        <DropdownMenu trigger={
          <DropdownButton title="Menu" children={<UrbitswapIcon className="h-5 w-5" />} />
        }>
          <DropdownEntry disabled children="Main Menu" />
          <DropdownEntry onSelect={() => navigate("/")}>
            <HomeIcon className="w-4 h-4" />
            <span>Go Home</span>
          </DropdownEntry>
          <DropdownEntry
            onSelect={() => modalNavigate("disclaimer", {
              relative: "path",
              state: {backgroundLocation: location},
            })}
          >
            <DocumentIcon className="w-4 h-4" />
            <span>View License</span>
          </DropdownEntry>
        </DropdownMenu>

        <div className="flex flex-row gap-2 flex-1 min-w-0">
          <label className="relative flex w-full items-center flex-1 min-w-0">
            <span className="sr-only">Search Prefences</span>
            <span className={cn(
              "absolute inset-y-[3px] left-0 h-8 w-8",
              "flex items-center pl-2 text-gray-400",
            )}>
              <MagnifyingGlassIcon
                className="h-5 w-5"
                style={{transform: "rotateY(180deg)"}}
              />
            </span>
            <input
              className={cn(
                "input h-9 w-full bg-gray-50 pl-8 pr-16 flex-1 min-w-0",
                "placeholder:font-normal focus-within:mix-blend-normal text-sm sm:text-md",
              )}
              placeholder={"Search"}
              value={queryName}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onSubmit={() => onSubmit()}
            />
            <span className={cn(
              "absolute inset-y-[3px] right-0 h-8 w-8",
              "flex items-center pr-14 text-gray-400",
            )}>
              <DropdownMenu trigger={
                (queryBase === "mine") ? (<WalletIcon className="h-5 w-5" />)
                : (queryBase === "bids") ? (<TagIcon className="h-5 w-5" />)
                : (<ViewfinderCircleIcon className="h-5 w-5" />)
              }>
                <DropdownEntry disabled children="Collection" />
                <DropdownEntry onSelect={() => onSubmit({base: undefined})}>
                  <ViewfinderCircleIcon className="w-5 h-5" />
                  <span>Full Collection</span>
                </DropdownEntry>
                <DropdownEntry onSelect={() => onSubmit({base: "mine"})}>
                  <WalletIcon className="w-5 h-5" />
                  <span>Owned Assets</span>
                </DropdownEntry>
                <DropdownEntry onSelect={() => onSubmit({base: "bids"})}>
                  <TagIcon className="w-5 h-5" />
                  <span>Bid Assets</span>
                </DropdownEntry>
              </DropdownMenu>
            </span>
            <span className={cn(
              "absolute inset-y-[3px] right-0 h-8 w-8",
              "flex items-center pr-2 text-gray-400",
            )}>
              <DropdownMenu trigger={
                (queryType === "galaxy") ? (<SparklesIcon className="h-5 w-5" />)
                : (queryType === "star") ? (<StarIcon className="h-5 w-5" />)
                : (queryType === "planet") ? (<GlobeAltIcon className="h-5 w-5" />)
                : (<FunnelIcon className="h-5 w-5" />)
              }>
                <DropdownEntry disabled children="Type Filter" />
                <DropdownEntry onSelect={() => onSubmit({type: undefined})}>
                  <FunnelIcon className="w-5 h-5" />
                  <span>No Filter</span>
                </DropdownEntry>
                <DropdownEntry onSelect={() => onSubmit({type: "galaxy"})}>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Galaxies</span>
                </DropdownEntry>
                <DropdownEntry onSelect={() => onSubmit({type: "star"})}>
                  <StarIcon className="w-5 h-5" />
                  <span>Stars</span>
                </DropdownEntry>
                <DropdownEntry onSelect={() => onSubmit({type: "planet"})}>
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Planets</span>
                </DropdownEntry>
              </DropdownMenu>
            </span>
          </label>
        </div>

        {/*TODO: The connected text shrinking isn't proply being applied to the title here.*/}
        <DropdownMenu trigger={
          <DropdownButton
            title={!isConnected ? "Wallet" : <ENSName address={address} />}
            children={<WalletIcon className="h-5 w-5" />}
            className={!isConnected ? "" : "text-blue-400 text-2xs"}
          />
        }>
          <DropdownEntry disabled>
            <span>Wallet</span>
            {(isKYCd && (<IdentificationIcon className="w-3 h-3" />))}
            {(isAssociated && (<LinkIcon className="w-3 h-3" />))}
          </DropdownEntry>
          <DropdownEntry onSelect={() => !isConnected ? connect() : disconnect()}>
            {!isConnected ? (<BoltIcon className="w-4 h-4" />) : (<BoltSlashIcon className="w-4 h-4" />)}
            <span>{`${isConnected ? "Disc" : "C"}onnect Wallet`}</span>
          </DropdownEntry>
          {/*(isConnected && !isKYCd) && (
            <DropdownEntry
              onSelect={() => modalNavigate("pretrade", {
                relative: "path",
                state: {backgroundLocation: location},
              })}
            >
              <IdentificationIcon className="w-4 h-4" />
              <span>Submit KYC</span>
            </DropdownEntry>
          )*/}
          {(isConnected && !isAssociated) && (
            <DropdownEntry
              onSelect={() => modalNavigate("assoc", {
                relative: "path",
                state: {backgroundLocation: location},
              })}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Associate @p</span>
            </DropdownEntry>
          )}
        </DropdownMenu>
      </div>
    </nav>
  );
}
