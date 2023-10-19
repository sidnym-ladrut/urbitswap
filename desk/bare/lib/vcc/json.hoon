/-  v=vcc
|%
++  enjs
  =,  enjs:format
  =>  |%
      ++  flagify
        |=  f=flag:v
        ^-  @t
        (rap 3 (scot %p p.f) '/' q.f ~)
      --
  |%
  ++  flag
    |=  f=flag:v
    ^-  json
    s+(flagify f)
  ::
  ++  traders
    |=  t=traders:v
    ^-  json
    %-  pairs
    %+  turn  ~(tap by t)
    |=  [a=@ux s=@p]
    [(crip (z-co:co a)) s+(scot %p s)]
  ::
  ++  action
    |=  [f=flag:v u=update:v]
    ^-  json
    %-  pairs
    =-  ~[['traders' s+(flagify f)] ['update' -]]
    %-  pairs
    :_  ~
    :-  -.u
    ?.  ?=([%asoc *] u)
      ~
    %-  pairs
    :~  ['addr' s+(crip (z-co:co addr.u))]
        ['sign' s+(crip (z-co:co sign.u))]
    ==
  --
::
++  dejs
  =,  dejs:format
  =,  soft=dejs-soft:format
  |%
  ++  nu2   (su ;~(pfix (jest '0x') hex))
  ++  flag  (su ;~((glue fas) ;~(pfix sig fed:ag) ^sym))
  ::
  ++  action
    |=  jon=json
    ;;  action:v
    %.  jon
    %-  ot
    :~  traders+flag
        :-  %update
        %-  of
        :~  init+ul
            drop+ul
            join+ul
            asoc+(ot ~[addr+nu2 sign+nu2])
  ==    ==
  --
--