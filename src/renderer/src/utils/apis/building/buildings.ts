import http from '../../advertisement'

export const getBuildings = (data: any) => {
  return http.get('api/buildings', { params: data })
}

export const getBuildingById = (id: string) => {
  return http.get(`api/buildings/${id}`)
}

export const loginBuilding = (data: any) => {
  return http.post('api/building_admin/login', data)
}
