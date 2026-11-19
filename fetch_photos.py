"""Build-time Wikimedia Commons photo importer; validates reuse license and records attribution."""
import concurrent.futures, html, io, json, pathlib, re, urllib.parse, urllib.request
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).parent / 'assets'
ITEMS = {
 'oil': ('Engine oil dipstick reading level.JPG','Пример щупа моторного масла'),
 'battery': ('Photo-CarBattery.jpg','Пример автомобильного аккумулятора'),
 'alternator': ('Alternator.jpg','Генератор другого автомобиля; пример внешнего вида'),
 'thermostat': ('Carthermostat.jpg','Типовой автомобильный термостат'),
 'radiator': ('Radiator.jpg','Пример радиатора'),
 'brakefluid': ('Brake fluid reservoir in Škoda Fabia I.jpg','Бачок на Škoda Fabia, пример внешнего вида'),
 'pads': ('Disc brake.jpg','Пример дискового тормоза'),
 'shock': ('Close-up of a car mechanic holding a shock absorber.jpg','Пример амортизатора'),
 'starter': ('Automobile starter.JPG','Типовой стартер с втягивающим реле'),
 'fuse': ('Closeup of the car fuses.jpg','Пример плавких предохранителей; не карта блока Нивы или Datsun'),
 'crank': ('Crankshaft sensor.png','Учебная иллюстрация типового индуктивного датчика'),
 'oxygen': ('Oxygen sensor.gif','Типовой кислородный датчик'),
 'throttle': ('Throttle body.jpg','Дроссель Rover K-series, пример внешнего вида'),
 'niva-transfer': ('Раздаточная коробка ВАЗ-2121, экземпляр музея АвтоВАЗ.jpg','Раздаточная коробка ВАЗ-2121, музей АвтоВАЗ'),
 'obd': ('OBD-USB connector.JPG','Пример диагностического адаптера OBD'),
 'timing-d': ('Timing belt.jpg','Пример ремня ГРМ'),
 'timing-n': ('Timing Chain.jpg','Цепь ГРМ Toyota Camry, пример внешнего вида'),
 'plug': ('Spark plugs.jpg','Пример свечей зажигания'),
 'air': ('Air filter for Toyota 1KR-FE.jpg','Пример фильтрующего элемента, двигатель Toyota'),
 'wheel': ('Muddy car tire.jpg','Пример автомобильной шины'),
 'washer': ('Man pouring windshield washer fluid.jpg','Пример заливной горловины омывателя'),
 'wipers': ('Windshield Wiper 2.jpg','Пример стеклоочистителя'),
 'datsun-cv': ('Tracta Constant Velocity Joint.jpg','Пример шарнира равных угловых скоростей; конструкция Datsun отличается'),
 'clutch': ('Clutch disc 1.jpg','Пример ведомого диска сцепления'),
 'pump': ('Automobile fuel tank inside.JPG','Учебный пример бака изнутри: датчик уровня и заборник'),
 'tank': ('Automobile Fuel tank cutaway.JPG','Учебный разрез автомобильного бака; не бак Нивы или Datsun'),
 'rail': ('Multi-point Gasoline fuel injection rail.jpg','Типовая рампа распределённого впрыска'),
 'injector': ('Fuel injectors.JPG','Пример топливных форсунок'),
 'pump-mech': ('Diaphragm Pump.png','Учебная схема диафрагменного насоса, приблизительная'),
}
def fetch(url):
    req = urllib.request.Request(url,headers={'User-Agent':'AutoEncyclopedia/0.2 (educational reference; Wikimedia attribution)'})
    with urllib.request.urlopen(req,timeout=40) as response:
        return response.read()
def clean(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
def lookup():
    args={'action':'query','titles':'|'.join('File:'+a[0] for a in ITEMS.values()),'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':640,'format':'json'}
    pages=json.loads(fetch('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(args)))['query']['pages']
    return {p['title'][5:]:p['imageinfo'][0] for p in pages.values() if 'imageinfo' in p}
def get_item(item, info):
    key,(title,caption)=item
    d=info[title]; meta=d['extmetadata']
    license=clean(meta['LicenseShortName']['value'])
    if not (license.startswith(('CC BY','CC0')) or license=='Public domain'):
        raise ValueError('unsupported license: '+license)
    try: payload=fetch(d.get('thumburl',d['url']))
    except Exception: payload=fetch(d['url'])
    image=ImageOps.exif_transpose(Image.open(io.BytesIO(payload))).convert('RGB')
    image.thumbnail((900,900))
    path=ROOT/'photos'/f'{key}.jpg'
    image.save(path,quality=85,optimize=True)
    return key,{'file':f'photos/{key}.jpg','caption':caption,'author':clean(meta.get('Artist',{}).get('value','')) or 'Wikimedia Commons contributor','license':license,'licenseUrl':meta.get('LicenseUrl',{}).get('value',''),'source':d['descriptionurl'],'modified':'Размер уменьшен, JPEG.'}
if __name__=='__main__':
    info=lookup()
    manifest=ROOT/'photo-data.js'
    result=json.loads(manifest.read_text(encoding='utf-8').removeprefix('const PHOTOS = ').strip().removesuffix(';')) if manifest.exists() else {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures={pool.submit(get_item,item,info):item[0] for item in ITEMS.items() if item[0] not in result}
        for future in concurrent.futures.as_completed(futures):
            try:
                k,v=future.result(); result[k]=v; print('OK',k,flush=True)
            except Exception as error: print('FAIL',futures[future],error,flush=True)
    (ROOT/'photo-data.js').write_text('const PHOTOS = '+json.dumps(result,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
