
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element, SubElement

class Svg(object):
    def __init__(self, width=800, height=400):
        self.width = width
        self.height = height
        self.raiz = Element('svg', xmlns="http://www.w3.org/2000/svg",
                            width=str(width), height=str(height))

    def addPolyline(self, points, stroke="black", strokeWidth="2", fill="none"):
        SubElement(self.raiz, 'polyline',
                   points=points,
                   stroke=stroke,
                   **({'stroke-width': strokeWidth} if strokeWidth else {}),
                   fill=fill)

    def addLine(self, x1, y1, x2, y2, stroke="black", strokeWidth="1"):
        SubElement(self.raiz, 'line',
                   x1=str(x1), y1=str(y1), x2=str(x2), y2=str(y2),
                   stroke=stroke,
                   **({'stroke-width': strokeWidth} if strokeWidth else {}))

    def addText(self, x, y, text, fontSize="12", anchor="middle"):
        SubElement(self.raiz, 'text',
                   x=str(x), y=str(y),
                   **{'font-size': fontSize, 'text-anchor': anchor}).text = str(text)

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

def extraer_altimetria(xml_file):
    ns = {'u': 'http://www.uniovi.es'}
    try:
        arbol = ET.parse(xml_file)
    except (IOError, ET.ParseError) as e:
        print("Error leyendo XML:", e)
        exit()

    raiz = arbol.getroot()
    puntos = []

    # punto origen
    origen = raiz.find('./u:puntoOrigen', ns)
    if origen is not None:
        alt = float(origen.find('u:altitud', ns).text)
        puntos.append((0.0, alt))  # distancia acumulada = 0

    # tramos
    dist_acum = 0.0
    for tramo in raiz.findall('./u:tramos/u:tramo', ns):
        dist = float(tramo.find('u:distancia', ns).text)
        dist_acum += dist
        alt = float(tramo.find('u:puntoFinal/u:altitud', ns).text)
        puntos.append((dist_acum, alt))

    return puntos

def main():
    xml_file = "circuitoEsquema.xml"
    svg_file = "altimetria.svg"

    puntos = extraer_altimetria(xml_file)
    if not puntos:
        print("No se encontraron puntos de altimetría.")
        return

    ancho, alto = 800, 400
    dist_max = max(x for x, y in puntos)
    alt_min = min(y for x, y in puntos)
    alt_max = max(y for x, y in puntos)

    # Normalizar coordenadas para SVG
    puntos_svg = []
    for x, y in puntos:
        x_svg = (x / dist_max) * (ancho - 60) + 30  # margen
        y_svg = alto - ((y - alt_min) / (alt_max - alt_min) * (alto - 60) + 30)
        puntos_svg.append((x_svg, y_svg))

    puntos_str = " ".join(f"{x},{y}" for x, y in puntos_svg)

    svg = Svg(ancho, alto)

    # Fondo cuadrícula
    for i in range(0, int(dist_max)+1, max(1, int(dist_max/10))):
        x = (i / dist_max) * (ancho - 60) + 30
        svg.addLine(x, 30, x, alto-30, stroke="#ccc", strokeWidth="1")
        svg.addText(x, alto-10, f"{i:.0f}", fontSize="10", anchor="middle")

    for i in range(int(alt_min), int(alt_max)+1, max(1, int((alt_max-alt_min)/8))):
        y = alto - ((i - alt_min) / (alt_max - alt_min) * (alto - 60) + 30)
        svg.addLine(30, y, ancho-30, y, stroke="#ccc", strokeWidth="1")
        svg.addText(10, y+3, f"{i:.0f}", fontSize="10", anchor="end")

    # Área debajo de la curva
    area_str = f"30,{alto-30} " + puntos_str + f" {ancho-30},{alto-30}"
    svg.addPolyline(area_str, stroke="none", fill="lightblue")

    # Línea de altimetría
    svg.addPolyline(puntos_str, stroke="red", strokeWidth="2", fill="none")

    # Ejes
    svg.addLine(30, 30, 30, alto-30, stroke="black", strokeWidth="2")  # eje Y
    svg.addLine(30, alto-30, ancho-30, alto-30, stroke="black", strokeWidth="2")  # eje X

    svg.escribir(svg_file)
    print(f"Archivo SVG generado: {svg_file}")

if __name__ == "__main__":
    main()
