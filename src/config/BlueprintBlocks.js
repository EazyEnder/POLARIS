import api from '../api'

const fetchBlocks = async () => {
    const response = await api.get('/blueprint/blocks');
    return response.data
  }

export const BLUEPRINT_BLOCKS = await fetchBlocks()