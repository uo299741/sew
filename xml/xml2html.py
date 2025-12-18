import xml.etree.ElementTree as ET

class Html:
    def __init__(self, title="Info del circuito"):
        self.lines = []
        self.lines.append('<!DOCTYPE html>')
        self.lines.append('<html lang="es">')
        self.lines.append('<head>')
        self.lines.append('    <meta charset="UTF-8">')
        self.lines.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.lines.append(f'    <title>{title}</title>')
        self.lines.append('    <link rel="stylesheet" href="../estilo/estilo.css">')
        self.lines.append('</head>')
        self.lines.append('<body>')

    def addHeading(self, text):
        self.lines.append(f'<h2>{text}</h2>')

    def addSubHeading(self, text):
        self.lines.append(f'<h3>{text}</h3>')

    def addParagraph(self, text):
        self.lines.append(f'<p>{text}</p>')

    def addList(self, items):
        self.lines.append('<ul>')
        for item in items:
            self.lines.append(f'<li>{item}</li>')
        self.lines.append('</ul>')

    def close(self):
        self.lines.append('</body>')
        self.lines.append('</html>')

    def escribir(self, filename):
        self.close()
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("\n".join(self.lines))
        print(f"Archivo HTML generado: {filename}")

def extraer_info(xml_file):
    ns = {'u': 'http://www.uniovi.es'}
    try:
        arbol = ET.parse(xml_file)
    except (IOError, ET.ParseError) as e:
        print("Error leyendo XML:", e)
        return None

    raiz = arbol.getroot()
    info = {}

    # Datos básicos
    info['nombre'] = raiz.find('./u:nombre', ns).text
    info['longitud'] = raiz.find('./u:longitud', ns).text
    info['anchuraMedia'] = raiz.find('./u:anchuraMedia', ns).text

    # Ubicación
    ubic = raiz.find('./u:ubicacion', ns)
    info['localidad'] = ubic.find('./u:localidad', ns).text
    info['pais'] = ubic.find('./u:pais', ns).text

    # Carrera
    carrera = raiz.find('./u:carrera', ns)
    info['fecha'] = carrera.find('./u:fecha', ns).text
    info['hora'] = carrera.find('./u:hora', ns).text
    info['vueltas'] = carrera.find('./u:numeroVueltas', ns).text
    info['patrocinador'] = carrera.find('./u:patrocinadorPrincipal', ns).text

    # Vencedor
    vencedor = raiz.find('./u:vencedor/u:nombre', ns)
    info['vencedor'] = vencedor.text if vencedor is not None else "N/A"

    # Primeros clasificados
    clasificados = []
    for c in raiz.findall('./u:primerosClasificados/u:clasificado', ns):
        nombre = c.find('./u:nombre', ns).text
        puesto = c.find('./u:puesto', ns).text
        clasificados.append(f"{puesto}º: {nombre}")
    info['primerosClasificados'] = clasificados

    # Referencias
    referencias = []
    for r in raiz.findall('./u:referencias/u:referencia', ns):
        texto = r.text
        url = r.get('direccion')
        referencias.append(f'<a href="{url}">{texto}</a>')
    info['referencias'] = referencias

    # Fotografías
    fotos = []
    for f in raiz.findall('./u:fotografias/u:fotografia', ns):
        desc = f.text
        src = f.get('direccion')
        fotos.append((desc, src))
    info['fotografias'] = fotos

    return info

def main():
    xml_file = "circuitoEsquema.xml"
    html_file = "InfoCircuito.html"

    info = extraer_info(xml_file)
    if not info:
        print("No se pudo extraer información del XML.")
        return

    html = Html(title=f"Info del circuito {info.get('nombre','')}")
    html.addHeading(f"Información del circuito: {info.get('nombre','')}")

    html.addSubHeading("Datos básicos")
    html.addParagraph(f"Longitud: {info['longitud']} metros")
    html.addParagraph(f"Anchura media: {info['anchuraMedia']} metros")
    html.addParagraph(f"Ubicación: {info['localidad']}, {info['pais']}")

    html.addSubHeading("Carrera")
    html.addParagraph(f"Fecha: {info['fecha']}  Hora: {info['hora']}")
    html.addParagraph(f"Número de vueltas: {info['vueltas']}")
    html.addParagraph(f"Patrocinador principal: {info['patrocinador']}")

    html.addSubHeading("Vencedor")
    html.addParagraph(f"{info['vencedor']}")

    html.addSubHeading("Primeros clasificados")
    html.addList(info['primerosClasificados'])

    html.addSubHeading("Referencias")
    html.addList(info['referencias'])

    html.addSubHeading("Fotografías")
    for desc, src in info['fotografias']:
        html.addParagraph(desc)
        html.lines.append(f'<img src="../{src}" alt="{desc}">')
    html.escribir(html_file)

if __name__ == "__main__":
    main()
