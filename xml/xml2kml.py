
import xml.etree.ElementTree as ET

class Kml(object):
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addLineString(self, nombre, extrude, tessellate, listaCoordenadas,
                      modoAltitud, color, ancho):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = extrude
        ET.SubElement(ls, 'tessellate').text = tessellate
        ET.SubElement(ls, 'coordinates').text = listaCoordenadas
        ET.SubElement(ls, 'altitudeMode').text = modoAltitud

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = color
        ET.SubElement(linea, 'width').text = ancho

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def extraer_coordenadas(xml_file):
    ns = {'u': 'http://www.uniovi.es'}
    try:
        arbol = ET.parse(xml_file)
    except (IOError, ET.ParseError) as e:
        print("Error leyendo el XML:", e)
        exit()

    raiz = arbol.getroot()
    coordenadas = []

    # Punto origen
    origen = raiz.find('./u:puntoOrigen', ns)
    if origen is not None:
        lon = origen.find('u:longitudPunto', ns).text
        lat = origen.find('u:latitud', ns).text
        alt = origen.find('u:altitud', ns).text
        coordenadas.append(f"{lon},{lat},{alt}")

    # Tramos
    for tramo in raiz.findall('./u:tramos/u:tramo/u:puntoFinal', ns):
        lon = tramo.find('u:longitudPunto', ns).text
        lat = tramo.find('u:latitud', ns).text
        alt = tramo.find('u:altitud', ns).text
        coordenadas.append(f"{lon},{lat},{alt}")

    return "\n".join(coordenadas)

def main():
    xml_file = "circuitoEsquema.xml"
    kml_file = "circuito.kml"

    print("Extrayendo coordenadas de", xml_file)
    coordenadas = extraer_coordenadas(xml_file)

    if not coordenadas:
        print("No se encontraron coordenadas en el XML.")
        return

    print("Generando archivo KML...")
    kml = Kml()
    kml.addLineString(
        nombre="Circuito",
        extrude="1",
        tessellate="1",
        listaCoordenadas=coordenadas,
        modoAltitud="relativeToGround",
        color="#ff0000ff",
        ancho="4"
    )
    kml.escribir(kml_file)
    print("Archivo KML generado:", kml_file)

if __name__ == "__main__":
    main()
