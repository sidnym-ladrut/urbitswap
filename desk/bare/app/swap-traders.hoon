/-  traders
/+  s=swap, j=swap-json
/+  verb, dbug
/+  *sss
/+  default-agent
^-  agent:gall
=>
  |%
  +$  state-0
    $:  %0
        our-traders=(map flag:s traders:s)
        sub-traders=_(mk-subs traders ,[%swap %traders @ @ ~])
        pub-traders=_(mk-pubs traders ,[%swap %traders @ @ ~])
    ==
  +$  versioned-state
    $%  state-0
    ==
  +$  card  card:agent:gall
  ++  master-flag
    ^-  flag:s
    :_  %master
    (slav %p ?:(dbug:s '~zod' '~firser-dister-sidnym-ladrut'))
  ++  path2flag
    |=  path=[%swap %traders @ @ ~]
    ^-  flag:s
    [`@p`(slav %p +>-.path) `@tas`(slav %tas +>+<.path)]
  --
=|  state-0
=*  state  -
=<
  %+  verb  dbug:s
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init
    ^-  (quip card _this)
    =^(cards state abet:init:cor [cards this])
  ++  on-save  !>(state)
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =^(cards state abet:(load:cor vase) [cards this])
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^(cards state abet:(poke:cor mark vase) [cards this])
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^(cards state abet:(watch:cor path) [cards this])
  ++  on-peek   peek:cor
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^(cards state abet:(agent:cor wire sign) [cards this])
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^(cards state abet:(arvo:cor wire sign) [cards this])
  --
|_  [=bowl:gall cards=(list card)]
::
+*  da-traders  =/  da  (da traders ,[%swap %traders @ @ ~])
               (da sub-traders bowl -:!>(*result:da) -:!>(*from:da) -:!>(*fail:da))
    du-traders  =/  du  (du traders ,[%swap %traders @ @ ~])
               (du pub-traders bowl -:!>(*result:du))
::
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  pull  |=([caz=(list card) sub=_sub-traders] =.(sub-traders sub (emil caz)))
++  push  |=([caz=(list card) pub=_pub-traders] =.(pub-traders pub (emil caz)))
::
++  init
  ^+  cor
  =/  master-core  (ta-abed:ta-core master-flag)
  ?:  =(our.bowl p:master-flag)
    ta-abet:ta-init:master-core
  ta-abet:ta-join:master-core
::
++  load
  |=  =vase
  ^+  cor
  =/  old  !<(versioned-state vase)
  %=    cor
      state
    ?-  -.old
      %0  old
    ==
  ==
::
++  poke
  |=  [=mark =vase]
  ^+  cor
  ?+    mark  ~|(bad-poke/mark !!)
  :: native pokes ::
      %swap-action
    =+  !<(=action:s vase)
    ?>  (~(has by all-traders) p.action)
    =/  trader-core  (ta-abed:ta-core p.action)
    ?:  =(p.p.action our.bowl)
      ta-abet:(ta-push:trader-core q.action)
    ?:  =(-.q.action %join)
      ta-abet:ta-join:trader-core
    ta-abet:(ta-proxy:trader-core q.action)
  :: sss pokes ::
      %sss-on-rock
    ?-  msg=!<(from:da-traders (fled vase))
      [[%swap *] *]  cor
    ==
  ::
      %sss-fake-on-rock
    ?-  msg=!<(from:da-traders (fled vase))
      [[%swap *] *]  (emil (handle-fake-on-rock:da-traders msg))
    ==
  ::
      %sss-to-pub
    ?-  msg=!<(into:du-traders (fled vase))
      [[%swap *] *]  (push (apply:du-traders msg))
    ==
  ::
      %sss-traders
    =/  res  !<(into:da-traders (fled vase))
    ta-abet:(ta-pull:(ta-abed:ta-core (path2flag path.res)) res)
  ==
::
++  watch
  |=  path=(pole knot)
  ^+  cor
  ?+    path  ~|(bad-watch-path/path !!)
      [%swap ship=@ name=@ ~]
    =/  ship=@p    (slav %p ship.path)
    =/  name=term  (slav %tas name.path)
    ?>(=(our src):bowl cor)
  ==
::
++  peek
  |=  path=(pole knot)
  ^-  (unit (unit cage))
  =/  all-traders=(map flag:s traders:s)  all-traders
  ?+    path  [~ ~]
      [%x ship=@ name=@ ~]
    =/  ship=@p    (slav %p ship.path)
    =/  name=term  (slav %tas name.path)
    ``swap-traders+!>((~(got by all-traders) ship name))
  ::
      [%u ship=@ name=@ ~]
    =/  ship=@p    (slav %p ship.path)
    =/  name=term  (slav %tas name.path)
    ``loob+!>((~(has by all-traders) ship name))
  ==
::
++  agent
  |=  [path=(pole knot) =sign:agent:gall]
  ^+  cor
  ?+    path  cor
  :: sss responses ::
      [~ %sss %on-rock @ @ @ %swap %traders @ @ ~]
    (pull ~ (chit:da-traders |3:path sign))
  ::
      [~ %sss %scry-request @ @ @ %swap %traders @ @ ~]
    (pull (tell:da-traders |3:path sign))
  ::
      [~ %sss %scry-response @ @ @ %swap %traders @ @ ~]
    (push (tell:du-traders |3:path sign))
  :: swap proxy response ::
      [%swap ship=@ name=@ ~]
    =/  ship=@p    (slav %p ship.path)
    =/  name=term  (slav %tas name.path)
    ?>  ?=(%poke-ack -.sign)
    ?~  p.sign  cor
    %-  (slog u.p.sign)
    cor
  ==
::
++  arvo
  |=  [path=(pole knot) sign=sign-arvo]
  ^+  cor
  cor
::
++  all-traders
  ^-  (map flag:s traders:s)
  %-  ~(uni by our-traders)
  %-  malt
  ^-  (list [flag:s traders:s])
  %+  turn  ~(tap by read:da-traders)
  |=  [[* * paths=[%swap %traders @ @ ~]] [stale=? fail=? =traders:s]]
  [(path2flag paths) traders]
++  ta-core
  |_  [=flag:s =traders:s gone=_|]
  ++  ta-core  .
  ++  ta-abet
    ?.  =(p.flag our.bowl)
      cor
    %_    cor
        our-traders
      ?:(gone (~(del by our-traders) flag) (~(put by our-traders) flag traders))
    ==
  ++  ta-abed
    |=  f=flag:s
    %=  ta-core
      flag     f
      traders  (~(gut by all-traders) f *traders:s)
    ==
  ::
  ++  ta-area  `path`/swap/(scot %p p.flag)/[q.flag]
  ++  ta-up-area  |=(p=path `(list path)`[(welp ta-area p)]~)
  ++  ta-du-path  [%swap %traders (scot %p p.flag) q.flag ~]
  ++  ta-da-path  [p.flag dap.bowl %swap %traders (scot %p p.flag) q.flag ~]
  ::
  ++  ta-init
    =.  ta-core  (ta-push [%init ~])
    =.  cor  (push (public:du-traders [ta-du-path]~))
    ta-core
  ++  ta-join
    =.  cor  (pull (surf:da-traders ta-da-path))
    ta-core
  ++  ta-leave
    ^+  ta-core
    =.  ta-core  (ta-notify [%drop ~])
    =.  cor  (pull ~ (quit:da-traders ta-da-path))
    ta-core(gone &)
  ::
  ++  ta-notify
    |=  =update:s
    ^+  ta-core
    =/  paths=(list path)  (ta-up-area /)
    ta-core(cor (give %fact paths %json !>((action:enjs:j flag update))))
  ++  ta-proxy
    |=  =update:s
    ^+  ta-core
    =/  =dock  [p.flag dap.bowl]
    =/  =cage  [%swap-action !>([flag update])]
    =.  cor  (emit %pass ta-area %agent dock %poke cage)
    ta-core
  ++  ta-pull
    |=  res=into:da-traders
    ^+  ta-core
    =/  =update:s
      ?-  what.res
        %tomb  [%drop ~]
        %wave  q.act.wave.res
        %rock  [%init ~]
      ==
    ?:  ?=(%drop -.update)
      ta-leave
    =.  ta-core  (ta-notify update)
    =.  cor  (pull (apply:da-traders res))
    ta-core
  ++  ta-push
    |=  =update:s
    ^+  ta-core
    ::  NOTE: Notify *before* state change to avoid errors during deletions.
    =.  ta-core  (ta-notify update)
    ?:  ?=(%drop -.update)
      =.  cor  (push (kill:du-traders [ta-du-path]~))
      ta-core(gone &)
    =.  traders  (apply:s traders bowl [flag update])
    =.  cor  (push (give:du-traders ta-du-path bowl [flag update]))
    ta-core
  --
--
