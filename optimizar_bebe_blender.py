import bpy
import os

def optimizar_modelo_bebe(ratio_decimate=0.18, exportar_glb=False, ruta_salida=""):
    """
    Script de automatización para optimizar modelos de ecografías 3D de bebés en Blender 4.x / 5.x.
    - Limpia vectores de normales bloqueadas (elimina manchas negras).
    - Suelda vértices duplicados y limpia geometría suelta.
    - Recalcula normales consistentes hacia afuera.
    - Reduce polígonos de forma inteligente preservando las facciones de la cara.
    - Aplica sombreado suave orgánico (Shade Auto Smooth).
    - Asigna el slot de material para Three.js.
    """
    obj = bpy.context.active_object
    if not obj or obj.type != 'MESH':
        print("ERROR: Por favor selecciona primero el modelo del bebé en el visor 3D.")
        return

    print(f"--- Iniciando optimización de: {obj.name} ---")
    caras_iniciales = len(obj.data.polygons)
    print(f"Polígonos iniciales: {caras_iniciales:,}")

    # 1. Asegurar Object Mode
    if bpy.context.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')

    # 2. Resetear transformaciones (Escala 1.0, Rotación 0, Posición en origen)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # 3. Borrar normales personalizadas corruptas (elimina puntos negros de importación)
    if obj.data.has_custom_normals:
        bpy.ops.mesh.customdata_custom_split_normals_clear()
        print("✓ Normales divididas personalizadas limpiadas.")

    # 4. Modo Edición: Limpieza de malla y soldadura
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Recalcular normales hacia afuera
    bpy.ops.mesh.normals_make_consistent(inside=False)
    
    # Soldar dobles y eliminar sueltos
    bpy.ops.mesh.delete_loose()
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    print("✓ Geometría suelta eliminada y vértices duplicados soldados.")

    # Volver a Modo Objeto
    bpy.ops.object.mode_set(mode='OBJECT')

    # 5. Aplicar Modificador Decimate (Collapse)
    decimate = obj.modifiers.new(name="Auto_Decimate_Baby", type='DECIMATE')
    decimate.decimate_type = 'COLLAPSE'
    decimate.ratio = ratio_decimate
    bpy.ops.object.modifier_apply(modifier=decimate.name)
    caras_finales = len(obj.data.polygons)
    print(f"✓ Decimate aplicado (Ratio: {ratio_decimate}). Polígonos finales: {caras_finales:,} (Reducción: {(1 - caras_finales/caras_iniciales)*100:.1f}%)")

    # 6. Sombreado Suave Orgánico (Blender 4.x / 5.x)
    try:
        bpy.ops.object.shade_auto_smooth()
    except Exception:
        bpy.ops.object.shade_smooth()
    print("✓ Shade Auto Smooth aplicado.")

    # 7. Asignar Slot de Material para WebGL
    nombre_material = "Mat_Bebe_Piel"
    if not obj.data.materials:
        mat = bpy.data.materials.new(name=nombre_material)
        mat.use_nodes = True
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0].name = nombre_material
    print(f"✓ Slot de material asignado: '{nombre_material}'.")

    # 8. Exportación automática a GLB con compresión Draco (Opcional)
    if exportar_glb and ruta_salida:
        os.makedirs(os.path.dirname(ruta_salida), exist_ok=True)
        bpy.ops.export_scene.gltf(
            filepath=ruta_salida,
            export_format='GLB',
            use_selection=True,
            export_apply=True,
            export_yup=True,
            export_draco_mesh_compression_enable=True,
            export_draco_mesh_compression_level=7,
            export_draco_position_quantization=14,
            export_draco_normal_quantization=10
        )
        print(f"✓ Archivo GLB ultraliviano exportado en: {ruta_salida}")

    print("--- ¡Optimización finalizada con éxito! ---")

# Ejecutar sobre el modelo actualmente seleccionado
# (Puedes cambiar exportar_glb=True y poner la ruta si quieres que exporte directo)
optimizar_modelo_bebe(ratio_decimate=0.18, exportar_glb=False)
